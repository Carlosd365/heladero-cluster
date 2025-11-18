import "../styles/PushPanel.css";

interface PushPanelProps {
    open: boolean;
    width?: number;
    children: React.ReactNode;
}

export default function PushPanel({ open, width = 300, children }: PushPanelProps) {
    return (
        <div className="push-panel" style={{ width: open ? width : 0, }}>
            <div className="push-panel-content">
                {children}
            </div>
        </div>
    );
}
