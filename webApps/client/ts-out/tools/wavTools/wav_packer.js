// From https://github.com/openai/openai-realtime-console/blob/main/src/lib/wavtools/lib/wav_packer.js
/**
 * Utility class for assembling PCM16 "audio/wav" data
 */
export class WavPacker {
    /**
     * Converts Float32Array of amplitude data to ArrayBuffer in Int16Array format
     */
    static floatTo16BitPCM(float32Array) {
        const buffer = new ArrayBuffer(float32Array.length * 2);
        const view = new DataView(buffer);
        let offset = 0;
        for (let i = 0; i < float32Array.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, float32Array[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }
        return buffer;
    }
    /**
     * Concatenates two ArrayBuffers
     */
    static mergeBuffers(leftBuffer, rightBuffer) {
        const tmpArray = new Uint8Array(leftBuffer.byteLength + rightBuffer.byteLength);
        tmpArray.set(new Uint8Array(leftBuffer), 0);
        tmpArray.set(new Uint8Array(rightBuffer), leftBuffer.byteLength);
        return tmpArray.buffer;
    }
    /**
     * Packs data into an Int16 format
     * @private
     * @param size - 0 = 1x Int16, 1 = 2x Int16
     * @param arg - value to pack
     */
    _packData(size, arg) {
        return [
            new Uint8Array([arg, arg >> 8]),
            new Uint8Array([arg, arg >> 8, arg >> 16, arg >> 24]),
        ][size];
    }
    /**
     * Packs audio into "audio/wav" Blob
     */
    pack(sampleRate, audio) {
        if (!audio?.bitsPerSample) {
            throw new Error('Missing "bitsPerSample"');
        }
        else if (!audio?.channels) {
            throw new Error('Missing "channels"');
        }
        else if (!audio?.data) {
            throw new Error('Missing "data"');
        }
        const { bitsPerSample, channels, data } = audio;
        const output = [
            // Header
            'RIFF',
            this._packData(1, 4 + (8 + 24) /* chunk 1 length */ + (8 + 8) /* chunk 2 length */), // Length
            'WAVE',
            // chunk 1
            'fmt ', // Sub-chunk identifier
            this._packData(1, 16), // Chunk length
            this._packData(0, 1), // Audio format (1 is linear quantization)
            this._packData(0, channels.length),
            this._packData(1, sampleRate),
            this._packData(1, (sampleRate * channels.length * bitsPerSample) / 8), // Byte rate
            this._packData(0, (channels.length * bitsPerSample) / 8),
            this._packData(0, bitsPerSample),
            // chunk 2
            'data', // Sub-chunk identifier
            this._packData(1, (channels[0].length * channels.length * bitsPerSample) / 8), // Chunk length
            data,
        ];
        const blob = new Blob(output, { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        return {
            blob,
            url,
            channelCount: channels.length,
            sampleRate,
            duration: data.byteLength / (channels.length * sampleRate * 2),
        };
    }
}
if (typeof globalThis !== 'undefined') {
    globalThis.WavPacker = WavPacker;
}
//# sourceMappingURL=wav_packer.js.map