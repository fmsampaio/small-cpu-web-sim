import { useRef, useState } from "react";

import styles from "./MemFilePicker.module.css"


interface MemFilePickerProps {
    onLoad: (content: string) => void | Promise<void>;
    onError?: (message: string) => void;
}

export default function MemFilePicker({
    onLoad,
    onError
}: MemFilePickerProps) {

    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    async function handleFileChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file) return;

        setLoading(true);

        try {
            if (!file.name.toLowerCase().endsWith(".mem")) {
                throw new Error("Selecione um arquivo .mem.");
            }

            const content = await file.text();

            await onLoad(content);

        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Erro ao carregar o arquivo.";

            onError?.(message);

        } finally {
            setLoading(false);

            // Permite selecionar novamente o mesmo arquivo
            event.target.value = "";
        }
    }

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept=".mem"
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            <button
                className={styles.button_4}
                type="button"
                disabled={loading}
                onClick={() => inputRef.current?.click()}
            >
                {loading ? "Loading..." : "Load Memories"}
            </button>
        </>
    );
}