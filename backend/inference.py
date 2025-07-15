from ultralytics import YOLO
import cv2
import numpy as np
from uuid import uuid4
from pathlib import Path

# Đường dẫn tuyệt đối đến thư mục backend/results
BASE_DIR = Path(__file__).resolve().parent
RESULTS_DIR = BASE_DIR / "results"
RESULTS_DIR.mkdir(exist_ok=True)  # đảm bảo thư mục tồn tại

# Load mô hình
model_pitch = YOLO(str(BASE_DIR / "model" / "best_1024.pt"))
model_players = YOLO(str(BASE_DIR / "model" / "best_pb.pt"))

# Màu cho từng nhãn
color_map = {
    'pitch': (0, 255, 0),
    'player': (255, 0, 0),
    'referee': (0, 255, 255),
    'goalkeeper': (255, 0, 255),
    'ball': (0, 0, 255),
}

def draw_combined_detections(frame, results_pitch, results_players):
    combined_frame = frame.copy()

    def draw_boxes(results, frame):
        for box in results.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cls_id = int(box.cls[0])
            label = results.names[cls_id]
            conf = float(box.conf[0])
            color = color_map.get(label, (200, 200, 200))
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, f"{label} {conf:.2f}", (x1, max(y1 - 10, 15)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

    def draw_keypoints(results, frame):
        if hasattr(results, "keypoints") and results.keypoints is not None:
            keypoints_all = results.keypoints.xy[0].cpu().numpy()
            for idx, (x, y) in enumerate(keypoints_all):
                if x > 0 and y > 0:
                    cv2.circle(frame, (int(x), int(y)), 5, (0, 255, 0), -1)
                    cv2.putText(frame, str(idx + 1), (int(x)+6, int(y)-6),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    draw_boxes(results_pitch, combined_frame)
    draw_keypoints(results_pitch, combined_frame)
    draw_boxes(results_players, combined_frame)
    return combined_frame

# def process_image(file_path):
#     image = cv2.imread(str(file_path))
#     results_pitch = model_pitch(image)[0]
#     results_players = model_players(image)[0]
#     combined = draw_combined_detections(image, results_pitch, results_players)

#     out_path = RESULTS_DIR / f"{uuid4().hex}.jpg"
#     success = cv2.imwrite(str(out_path), combined)

#     if not success:
#         print("❌ Không thể lưu ảnh vào:", out_path)
#     else:
#         print("✅ Ảnh đã lưu tại:", out_path)

#     return str(out_path)
import time

def count_objects(results):
    counter = {}
    for box in results.boxes:
        label = results.names[int(box.cls[0])]
        counter[label] = counter.get(label, 0) + 1
    return counter

def avg_confidence(results):
    confs = [float(box.conf[0]) for box in results.boxes]
    return round(sum(confs)/len(confs), 4) if confs else 0.0

def process_image(file_path):
    image = cv2.imread(str(file_path))
    start_time = time.time()

    results_pitch = model_pitch(image)[0]
    results_players = model_players(image)[0]

    combined = draw_combined_detections(image, results_pitch, results_players)

    out_path = RESULTS_DIR / f"{uuid4().hex}.jpg"
    cv2.imwrite(str(out_path), combined)

    elapsed = round((time.time() - start_time) * 1000)  # ms

    # Tổng hợp thông tin
    counts = count_objects(results_pitch)
    counts_players = count_objects(results_players)
    for k, v in counts_players.items():
        counts[k] = counts.get(k, 0) + v

    avg_conf = round(
        (avg_confidence(results_pitch) + avg_confidence(results_players)) / 2, 4
    )

    return {
        "output_path": str(out_path),
        "processing_time_ms": elapsed,
        "counts": counts,
        "confidence_avg": avg_conf
    }

def process_video(file_path):
    cap = cv2.VideoCapture(str(file_path))
    out_path = RESULTS_DIR / f"{uuid4().hex}.mp4"
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    out = cv2.VideoWriter(str(out_path), fourcc, fps, (width, height))

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        results_pitch = model_pitch(frame)[0]
        results_players = model_players(frame)[0]
        combined_frame = draw_combined_detections(frame, results_pitch, results_players)
        out.write(combined_frame)

    cap.release()
    out.release()

    print("✅ Video đã lưu tại:", out_path)
    return str(out_path)
