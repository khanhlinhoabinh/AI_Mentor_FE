import { Package, Database, Lock, Upload, FlaskConical, Flag } from "lucide-react";

// Backend chỉ cần trả về icon key (string), FE tự map sang icon component.
const ICON_MAP = {
  package: Package,
  database: Database,
  lock: Lock,
  upload: Upload,
  flask: FlaskConical,
};

export function getMilestoneIcon(iconKey) {
  return ICON_MAP[iconKey] || Flag;
}