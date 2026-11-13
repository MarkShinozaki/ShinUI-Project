import {
  Aperture,
  ArrowLeftRight,
  Bot,
  Boxes,
  ChartSpline,
  Clapperboard,
  Eye,
  Frame,
  Gamepad2,
  LayoutTemplate,
  MessagesSquare,
  MousePointerClick,
  Palette,
  PenTool,
  RectangleHorizontal,
  ScrollText,
  Shapes,
  Smartphone,
  Sparkles,
  Volume2,
  Waves,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Aperture,
  ArrowLeftRight,
  Bot,
  Boxes,
  ChartSpline,
  Clapperboard,
  Eye,
  Frame,
  Gamepad2,
  LayoutTemplate,
  MessagesSquare,
  MousePointerClick,
  Palette,
  PenTool,
  RectangleHorizontal,
  ScrollText,
  Shapes,
  Smartphone,
  Sparkles,
  Volume2,
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
