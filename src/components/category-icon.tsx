import {
  Aperture,
  ArrowLeftRight,
  Boxes,
  ChartSpline,
  Eye,
  Frame,
  Gamepad2,
  LayoutTemplate,
  MessagesSquare,
  MousePointerClick,
  Palette,
  PenTool,
  Shapes,
  Smartphone,
  Sparkles,
  Waves,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Aperture,
  ArrowLeftRight,
  Boxes,
  ChartSpline,
  Eye,
  Frame,
  Gamepad2,
  LayoutTemplate,
  MessagesSquare,
  MousePointerClick,
  Palette,
  PenTool,
  Shapes,
  Smartphone,
  Sparkles,
  Waves,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name] ?? Boxes;
  return <Icon className={className} />;
}
