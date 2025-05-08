"use client"

import { Transak, TransakConfig } from "@transak/transak-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TransakWidget(
    { transakConfig }: { transakConfig: TransakConfig }
) {
    const [transakInstance, setTransakInstance] = useState<Transak | null>(null);
    const router = useRouter();


    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (transakInstance) {
                transakInstance.close();
            }
        };
    }, [transakInstance]);

    useEffect(() => {
        const containerId = transakConfig.containerId || 'transakMount';
        let container = document.getElementById(containerId);

        // If container doesn't exist, create it
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            document.body.appendChild(container);
        }

        // Make sure container is visible
        container.style.display = 'block';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.zIndex = '9999';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

        // Create a new Transak instance
        const transak = new Transak({
            ...transakConfig,
            containerId: containerId
        });

        setTransakInstance(transak);
        transak.init();

        // This will trigger when the user closed the widget
        Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, (eventData) => {
            console.log(eventData);
            if (transak) {
                transak.close();
                setTransakInstance(null);
            }
            // Hide the container
            if (container) {
                container.style.display = 'none';
            }
            router.push('/');
        });

        // This will trigger when the user marks payment is made.
        Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
            console.log(orderData);
            if (transak) {
                transak.close();
                setTransakInstance(null);
            }
            // Hide the container
            if (container) {
                container.style.display = 'none';
            }
            router.push('/onramp/success');
        });

        // Cleanup function
        return () => {
            if (transak) {
                transak.close();
            }
        };
    }, [transakConfig, router]);

    return (
        <div className="w-full h-full">
            <div id="transakMount" className="w-full h-full"></div>
        </div>
    );
}
