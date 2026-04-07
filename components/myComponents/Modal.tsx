'use client';

import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export default function Modal({ isOpen, onClose, title, children, className = "max-w-md p-6" }: ModalProps) {
    // Oprește scroll-ul pe body când modalul e deschis
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-all">
            {/* Containerul care prinde click-ul pe fundal pentru a închide modalul */}
            <div className="absolute inset-0" onClick={onClose}></div>

            {/* Conținutul Modalului */}
            <div className={`relative z-10 w-full rounded-xl bg-card border border-border/50 text-card-foreground shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${className}`}>
                {title && (
                    <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-4 shrink-0">
                        <div className="text-xl font-bold tracking-tight">{title}</div>
                        <button
                            onClick={onClose}
                            className="rounded-full p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                )}
                
                <div className="overflow-y-auto w-full custom-scrollbar pr-2">
                    {children}
                </div>
            </div>
        </div>
    );
}