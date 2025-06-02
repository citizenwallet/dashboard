'use client'
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

export const ColorPicker = ({ value, onChange }: { value: string; onChange: (color: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Handle color picker change
    const handleReactColorfulChange = (color: string) => {
        onChange(color);
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
                <PopoverContent className="w-80 p-4">
                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium">
                                Color Picker
                            </Label>
                            <div className="mt-2">
                                <HexColorPicker
                                    color={value}
                                    onChange={handleReactColorfulChange}
                                    style={{ width: '100%', height: '200px' }}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="hex-color-input" className="text-sm font-medium">
                                Hex Color
                            </Label>
                            <HexColorInput
                                id="hex-color-input"
                                color={value}
                                onChange={handleReactColorfulChange}
                                prefixed
                                style={{
                                    marginTop: '4px',
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                                placeholder="#3B82F6"
                            />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            <HexColorInput
                color={value}
                onChange={handleReactColorfulChange}
                prefixed
                style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                }}
                placeholder="Enter hex color"
            />
        </div>
    );
};