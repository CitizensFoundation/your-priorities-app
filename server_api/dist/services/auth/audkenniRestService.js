import axios from "axios";
export default class AudkenniRestService {
    constructor() {
        this.endpoint = "https://idp.audkenni.is/sso/json/realms/root/realms/audkenni/authenticate";
        this.client = axios.create({
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            validateStatus: () => true,
        });
    }
    async start() {
        const { data } = await this.client.post(this.endpoint, {});
        return data;
    }
    async authenticate(phone, authenticator) {
        const startData = await this.start();
        if (!startData.authId || !startData.callbacks) {
            throw new Error('Invalid start response');
        }
        const callbacks = (startData.callbacks || []).map((cb) => {
            if (cb.type === 'NameCallback') {
                cb.input[0].value = phone;
            }
            else if (cb.type === 'ChoiceCallback') {
                const choices = cb.output?.find((o) => o.name === 'choices')?.value || [];
                const idx = choices.findIndex((c) => c.toLowerCase().includes(authenticator));
                cb.input[0].value = idx >= 0 ? idx : 0;
            }
            return cb;
        });
        const cont = await this.continue(startData.authId, callbacks);
        return this.poll(cont.authId || startData.authId, cont.callbacks);
    }
    async continue(authId, callbacks) {
        const payload = { authId, callbacks };
        const { data } = await this.client.post(this.endpoint, payload);
        return data;
    }
    async poll(authId, callbacks, interval = 2000, maxAttempts = 30) {
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
