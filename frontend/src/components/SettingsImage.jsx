

// Don't need a css file, use same styling from SelectLevelPage.css

function SettingsImage() {
    
    return (
    <button className="settings-button" disabled>
        <img src={`${import.meta.env.BASE_URL}settings.png`} alt="Settings" className="settings-image" />
    </button>
);
}

export default SettingsImage;