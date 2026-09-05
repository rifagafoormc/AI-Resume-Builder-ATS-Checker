import { ProfessionalTemplate, ModernTemplate, CreativeTemplate } from "./ResumeTemplates";
import "./ResumeTemplates.css";

// data: the in-progress resume object (partial is fine, sections just won't render yet)
// template: "professional" | "modern" | "creative"
function LivePreview({ data, template }) {
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} />;
      case "creative":
        return <CreativeTemplate data={data} />;
      case "professional":
      default:
        return <ProfessionalTemplate data={data} />;
    }
  };

  return (
    <div className="live-preview-sticky">
      <p className="live-preview-label">Live Preview</p>
      <div className="live-preview-scale-wrapper">
        <div className="live-preview-scale-inner">{renderTemplate()}</div>
      </div>
    </div>
  );
}

export default LivePreview;