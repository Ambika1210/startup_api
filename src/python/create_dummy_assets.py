from moviepy import ColorClip
import os

def create_video(filename, color, text, duration=5):
    print(f"Generating {filename}...")
    try:
        # Minimal arguments for v2 compatibility
        clip = ColorClip(size=(640, 360), color=color, duration=duration)
        clip.fps = 24
        clip.write_videofile(filename, codec='libx264', audio_codec='aac')
    except Exception as e:
        print(f"Failed to create {filename}: {e}")

if __name__ == "__main__":
    create_video("test_a_roll.mp4", (100, 100, 100), "A-Roll", duration=10)
    create_video("test_b_roll_1.mp4", (255, 0, 0), "B-Roll 1", duration=4)
    create_video("test_b_roll_2.mp4", (0, 255, 0), "B-Roll 2", duration=4)
    print("Assets created.")
