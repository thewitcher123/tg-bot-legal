type DeleteModalProps = {
    open: boolean;
    title: string;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
};

export function DeleteModal({
                                open,
                                title,
                                onClose,
                                onConfirm,
                            }: DeleteModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative z-10 w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950/95 p-6 shadow-2xl shadow-black/60">
                <div className="mb-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-900/50">
                        <span className="text-xl">🗑️</span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-zinc-100">
                        Delete {title}?
                    </h3>
                    <p className="mt-2 text-sm text-zinc-400">
                        This action cannot be undone. This will permanently delete the
                        {title.toLowerCase()} and remove it from our servers.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            await onConfirm();
                            onClose();
                        }}
                        className="flex-1 rounded-lg border border-red-600 bg-red-600 px-4 py-2 text-sm font-semibold text-red-50 shadow-md shadow-red-500/40 hover:border-red-500 hover:bg-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}