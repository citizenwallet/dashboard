'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";


export const ColorPicker = ({ value, onChange }: { value: string; onChange: (color: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    const presetColors = [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899',
        '#06B6D4', '#84CC16', '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
    ];

    const handleColorChange = (color: string) => {
        setLocalValue(color);
        onChange(color);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        if (/^#[0-9A-F]{6}$/i.test(newValue)) {
            onChange(newValue);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-12 h-10 p-0 border-2"
                        style={{ backgroundColor: value }}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span className="sr-only">Pick a color</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="color-input" className="text-sm font-medium">
                                Hex Color
                            </Label>
                            <Input
                                id="color-input"
                                type="text"
                                value={localValue}
                                onChange={handleInputChange}
                                placeholder="#3B82F6"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Preset Colors</Label>
                            <div className="grid grid-cols-6 gap-2 mt-2">
                                {presetColors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={cn(
                                            "w-8 h-8 rounded border-2 border-gray-200 hover:scale-110 transition-transform",
                                            value === color && "ring-2 ring-blue-500 ring-offset-2"
                                        )}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleColorChange(color)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            <Input
                type="text"
                value={localValue}
                onChange={handleInputChange}
                placeholder="#3B82F6"
                className="flex-1"
            />
        </div>
    );
};