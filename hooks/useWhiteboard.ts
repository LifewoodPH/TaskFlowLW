import { useState, useEffect } from 'react';

export interface Resource {
    id: string;
    title: string;
    url: string;
    category: 'Design' | 'Development' | 'Documentation' | 'Other';
    addedBy?: string;
    timestamp: string;
}

export const useWhiteboard = () => {
    // Resources State
    const [resources, setResources] = useState<Resource[]>([]);

    // Canvas State (Base64 string of the image)
    const [canvasData, setCanvasData] = useState<string | null>(null);

    // Load data on mount
    useEffect(() => {
        const savedResources = localStorage.getItem('team_resources');
        if (savedResources) {
            setResources(JSON.parse(savedResources));
        }

        const savedCanvas = localStorage.getItem('whiteboard_snapshot');
        if (savedCanvas) {
            setCanvasData(savedCanvas);
        }
    }, []);

    // Resource Actions
    const addResource = (title: string, url: string, category: Resource['category'] = 'Other') => {
        const newResource: Resource = {
            id: crypto.randomUUID(),
            title,
            url: !url.startsWith('http') ? `https://${url}` : url,
            category,
            timestamp: new Date().toISOString(),
        };

        const updated = [newResource, ...resources];
        setResources(updated);
        localStorage.setItem('team_resources', JSON.stringify(updated));
    };

    const removeResource = (id: string) => {
        const updated = resources.filter(r => r.id !== id);
        setResources(updated);
        localStorage.setItem('team_resources', JSON.stringify(updated));
    };

    // Canvas Actions
    const saveCanvas = (dataUrl: string) => {
        setCanvasData(dataUrl);
        localStorage.setItem('whiteboard_snapshot', dataUrl);
    };

    const clearCanvas = () => {
        setCanvasData(null);
        localStorage.removeItem('whiteboard_snapshot');
    };

    return {
        resources,
        addResource,
        removeResource,
        canvasData,
        saveCanvas,
        clearCanvas
    };
};
