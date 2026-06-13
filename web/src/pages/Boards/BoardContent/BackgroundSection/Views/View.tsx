import { NatureGallery } from "@/components/Image/NatureGallery";
import BackgroundPreview from "../BackgroundPreview";
import { useBackgroundPicker } from "@/context/BackgroundPickerContext";

// ── MainView ──
export function MainView() {
  const {
    setView,
    selectedId,
    setNatureImages,
    gradientColors,
    gradientImageColors,
    handleSelectNature,
    handleSelectColor,
  } = useBackgroundPicker();

  return (
    <>
      {/* Ảnh */}
      <div className="text-trello-addBoard-text mb-2 flex items-center justify-between">
        <span className="text-xs font-bold">Ảnh</span>
        <button
          className="text-xs hover:underline"
          onClick={() => setView("photos")}
        >
          Xem thêm
        </button>
      </div>
      <div className="mb-3 grid grid-cols-3 gap-2">
        <NatureGallery
          imgSize="h-14"
          imgType="regular"
          imgCount={6}
          selectedId={selectedId}
          onSelect={handleSelectNature}
          onDataLoaded={setNatureImages}
        />
      </div>

      {/* Màu */}
      <div className="text-trello-addBoard-text mb-2 flex items-center justify-between">
        <span className="text-xs font-bold">Màu sắc</span>
        <button
          className="text-xs hover:underline"
          onClick={() => setView("colors")}
        >
          Xem thêm
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <BackgroundPreview
          items={gradientImageColors || gradientColors}
          imgClass="h-14"
          type="image"
          limit={6}
          selectedId={selectedId}
          onSelect={handleSelectColor}
        />
      </div>
    </>
  );
}

// ── PhotosView ──
export function PhotosView() {
  const { selectedId, setNatureImages, handleSelectNature } =
    useBackgroundPicker();

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <NatureGallery
          imgSize="h-18"
          imgType="regular"
          imgCount={20}
          selectedId={selectedId}
          onSelect={handleSelectNature}
          onDataLoaded={setNatureImages}
        />
      </div>
    </>
  );
}

// ── ColorsView ──
export function ColorsView() {
  const {
    selectedId,
    gradientColors,
    solidColors,
    gradientImageColors,
    handleSelectColor,
  } = useBackgroundPicker();

  return (
    <>
      {/* Gradient colors */}
      <div className="mb-3 grid grid-cols-3 gap-1">
        <BackgroundPreview
          items={gradientImageColors || gradientColors}
          imgClass="h-14"
          type="image"
          selectedId={selectedId}
          onSelect={handleSelectColor}
        />
      </div>
      <hr className="mb-3" />
      {/* Solid colors */}
      <div className="grid grid-cols-3 gap-1">
        <BackgroundPreview
          items={solidColors}
          imgClass="h-14"
          type="color"
          selectedId={selectedId}
          onSelect={handleSelectColor}
        />
      </div>
    </>
  );
}
