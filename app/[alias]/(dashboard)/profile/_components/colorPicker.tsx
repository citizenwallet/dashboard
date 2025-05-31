'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Helper function to convert various color formats to hex
const normalizeColor = (color: string): string => {

    color = color.trim();

    // If it's already a valid hex color, return as-is
    if (/^#[0-9A-F]{3}$/i.test(color)) {
        const r = color[1];
        const g = color[2];
        const b = color[3];
        return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }

    if (/^#[0-9A-F]{6}$/i.test(color)) {
        return color.toLowerCase();
    }

    // Handle hex without #
    if (/^[0-9A-F]{3}$/i.test(color)) {
        const r = color[0];
        const g = color[1];
        const b = color[2];
        return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }

    if (/^[0-9A-F]{6}$/i.test(color)) {
        return `#${color.toLowerCase()}`;
    }

    // Handle rgb() format
    const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        if (r <= 255 && g <= 255 && b <= 255) {
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }
    }

    // Handle rgba() format
    const rgbaMatch = color.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*[\d.]+\s*\)/i);
    if (rgbaMatch) {
        const r = parseInt(rgbaMatch[1]);
        const g = parseInt(rgbaMatch[2]);
        const b = parseInt(rgbaMatch[3]);
        if (r <= 255 && g <= 255 && b <= 255) {
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }
    }

    // Handle hsl() format (basic conversion)
    const hslMatch = color.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i);
    if (hslMatch) {
        const h = parseInt(hslMatch[1]) / 360;
        const s = parseInt(hslMatch[2]) / 100;
        const l = parseInt(hslMatch[3]) / 100;

        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        const rHex = Math.round(r * 255).toString(16).padStart(2, '0');
        const gHex = Math.round(g * 255).toString(16).padStart(2, '0');
        const bHex = Math.round(b * 255).toString(16).padStart(2, '0');
        return `#${rHex}${gHex}${bHex}`;
    }

    // Return original if no format matches
    return color;
};

export const ColorPicker = ({ value, onChange }: { value: string; onChange: (color: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    const presetColors = [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899',
        '#06B6D4', '#84CC16', '#F97316', '#6366F1', '#14B8A6', '#F43F5E',
        '#000000', '#FFFFFF', '#6B7280', '#374151', '#FEF3C7', '#DBEAFE'
    ];

    // Update local value when prop value changes
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleColorChange = (color: string) => {
        const normalizedColor = normalizeColor(color);
        setLocalValue(normalizedColor);
        onChange(normalizedColor);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        // Try to normalize and validate the color
        const normalizedColor = normalizeColor(newValue);
        if (normalizedColor !== newValue && /^#[0-9A-F]{6}$/i.test(normalizedColor)) {
            onChange(normalizedColor);
        } else if (/^#[0-9A-F]{6}$/i.test(newValue)) {
            onChange(newValue);
        }
    };

    const handleNativeColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        handleColorChange(color);
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
                            <Label htmlFor="native-color-picker" className="text-sm font-medium">
                                Color Picker
                            </Label>
                            <div className="mt-2 flex items-center space-x-2">
                                <input
                                    id="native-color-picker"
                                    type="color"
                                    value={value}
                                    onChange={handleNativeColorPickerChange}
                                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                />
                                <div className="text-sm text-gray-600">Click to open color picker</div>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="color-input" className="text-sm font-medium">
                                Color Code
                            </Label>
                            <Input
                                id="color-input"
                                type="text"
                                value={localValue}
                                onChange={handleInputChange}
                                placeholder="#3B82F6, rgb(59, 130, 246), hsl(217, 91%, 60%)"
                                className="mt-1"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                Supports: hex, rgb(), rgba(), hsl(), hsla()
                            </div>
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
                placeholder="Enter any color format"
                className="flex-1"
            />
        </div>
    );
};