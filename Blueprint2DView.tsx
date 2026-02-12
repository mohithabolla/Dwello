import React, { useState, useRef, useEffect } from 'react';

interface Room {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
}

interface Blueprint2DViewProps {
    rooms: Room[];
    landLength: number;
    landWidth: number;
    onRoomMove?: (index: number, newX: number, newY: number) => void;
}

const Blueprint2DView: React.FC<Blueprint2DViewProps> = ({ rooms, landLength, landWidth, onRoomMove }) => {
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const scale = Math.min(400 / landLength, 400 / landWidth);
    const viewWidth = landLength * scale;
    const viewHeight = landWidth * scale;

    const colors: Record<string, string> = {
        living: '#4a4e69', // dwello-grape
        utility: '#c9ada7', // dwello-silk
        private: '#22223b', // dwello-indigo
    };

    const getMouseCoords = (e: React.MouseEvent | MouseEvent) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const CTM = svgRef.current.getScreenCTM();
        if (!CTM) return { x: 0, y: 0 };
        return {
            x: (e.clientX - CTM.e) / CTM.a,
            y: (e.clientY - CTM.f) / CTM.d
        };
    };

    const handleMouseDown = (e: React.MouseEvent, index: number) => {
        const coords = getMouseCoords(e);
        const room = rooms[index];
        setDraggingIndex(index);
        setDragStart({ x: coords.x - room.x, y: coords.y - room.y });
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (draggingIndex === null || !dragStart || !onRoomMove) return;
            const coords = getMouseCoords(e);
            let newX = coords.x - dragStart.x;
            let newY = coords.y - dragStart.y;

            // Constrain to land
            const room = rooms[draggingIndex];
            newX = Math.max(0, Math.min(landLength - room.width, newX));
            newY = Math.max(0, Math.min(landWidth - room.height, newY));

            onRoomMove(draggingIndex, Math.round(newX), Math.round(newY));
        };

        const handleMouseUp = () => {
            setDraggingIndex(null);
            setDragStart(null);
        };

        if (draggingIndex !== null) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingIndex, dragStart, rooms, landLength, landWidth, onRoomMove]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-dwello-lilac/20 shadow-inner flex flex-col items-center select-none">
            <h3 className="text-[10px] font-black uppercase text-dwello-lilac tracking-widest mb-2 self-start">Interactive 2D Layout</h3>
            <p className="text-[8px] text-dwello-lilac/60 uppercase mb-4 self-start italic">Drag rooms to adjust placement</p>
            <svg
                ref={svgRef}
                width={viewWidth}
                height={viewHeight}
                viewBox={`0 0 ${landLength} ${landWidth}`}
                className="drop-shadow-xl"
            >
                {/* Land Boundary */}
                <rect
                    x="0"
                    y="0"
                    width={landLength}
                    height={landWidth}
                    fill="white"
                    fillOpacity="0.05"
                    stroke="#9a8c98"
                    strokeWidth="0.5"
                    strokeDasharray="1,1"
                />

                {/* Rooms */}
                {rooms.map((room, i) => (
                    <g
                        key={i}
                        onMouseDown={(e) => handleMouseDown(e, i)}
                        className="cursor-move"
                    >
                        <rect
                            x={room.x}
                            y={room.y}
                            width={room.width}
                            height={room.height}
                            fill={colors[room.type] || '#4a4e69'}
                            stroke="white"
                            strokeWidth={draggingIndex === i ? "0.8" : "0.2"}
                            className="transition-all hover:opacity-90"
                            style={{
                                filter: draggingIndex === i ? 'drop-shadow(0px 0px 4px rgba(255,255,255,0.5))' : 'none'
                            }}
                        />
                        <text
                            x={room.x + room.width / 2}
                            y={room.y + room.height / 2}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="white"
                            className="font-bold pointer-events-none"
                            style={{ fontSize: Math.max(1, room.width / 6) }}
                        >
                            {room.name}
                        </text>
                        <text
                            x={room.x + room.width / 2}
                            y={room.y + room.height / 2 + Math.max(2, room.height / 4)}
                            textAnchor="middle"
                            fill="white"
                            opacity="0.6"
                            className="font-medium pointer-events-none"
                            style={{ fontSize: Math.max(0.8, room.width / 10) }}
                        >
                            {room.width}' x {room.height}'
                        </text>
                    </g>
                ))}
            </svg>
            <div className="mt-6 flex gap-4 text-[8px] font-black uppercase tracking-widest text-dwello-grape">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-dwello-indigo rounded-full"></div> Private
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-dwello-grape rounded-full"></div> Living
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-dwello-silk rounded-full"></div> Utility
                </div>
            </div>
        </div>
    );
};

export default Blueprint2DView;
