import axios from "axios";

export interface AudkenniAuthResponse {
  authId?: string;
  callbacks?: any[];
  tokenId?: string;
  [key: string]: any;
}

export default class AudkenniRestService {
  private endpoint =
    "https://idp.audkenni.is/sso/json/realms/root/realms/audkenni/authenticate";

  private client = axios.create({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });

  async start(): Promise<AudkenniAuthResponse> {
    const { data } = await this.client.post(this.endpoint, {});
    return data;
  }

  async authenticate(
    phone: string,
    authenticator: 'sim' | 'app'
  ): Promise<AudkenniAuthResponse> {
    const startData = await this.start();

    if (!startData.authId || !startData.callbacks) {
      throw new Error('Invalid start response');
    }

    const callbacks = (startData.callbacks || []).map((cb: any) => {
      if (cb.type === 'NameCallback') {
        cb.input[0].value = phone;
      } else if (cb.type === 'ChoiceCallback') {
        const choices = cb.output?.find((o: any) => o.name === 'choices')?.value || [];
        const idx = choices.findIndex((c: string) => c.toLowerCase().includes(authenticator));
        cb.input[0].value = idx >= 0 ? idx : 0;
      }
      return cb;
    });

    const cont = await this.continue(startData.authId, callbacks);
    return this.poll(cont.authId || startData.authId, cont.callbacks);
  }

  async continue(authId: string, callbacks: any[]): Promise<AudkenniAuthResponse> {
    const payload = { authId, callbacks };
    const { data } = await this.client.post(this.endpoint, payload);
    return data;
  }

  async poll(
    authId: string,
    callbacks?: any[],
    interval = 2000,
    maxAttempts = 30
  ): Promise<AudkenniAuthResponse> {
    for (let i = 0; i < maxAttempts; i++) {
      const payload = callbacks ? { authId, callbacks } : { authId };
      const { data } = await this.client.post(this.endpoint, payload);
      if (data.tokenId) {
        return data;
      }
      await new Promise((r) => setTimeout(r, interval));
    }
    throw new Error("Timeout waiting for tokenId");
  }
}
