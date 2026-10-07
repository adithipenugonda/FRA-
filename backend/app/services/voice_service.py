from __future__ import annotations

from dataclasses import dataclass


@dataclass
class SpeechFallbackResult:
    ok: bool = False
    text: str = ""
    message: str = "Speech-to-text is not configured for this deployment. Please type your question or provide browser speech recognition input."


class SpeechToTextProvider:
    def transcribe(self, audio_bytes: bytes | None = None, text: str | None = None) -> SpeechFallbackResult:
        if text and text.strip():
            return SpeechFallbackResult(ok=True, text=text.strip())
        if audio_bytes is None:
            return SpeechFallbackResult(ok=False)
        return SpeechFallbackResult(ok=False, message="No speech-to-text provider is configured. Upload a transcript or use browser speech recognition.")


class TextToSpeechProvider:
    def synthesize(self, text: str) -> dict:
        return {
            "enabled": False,
            "message": "Text-to-speech is unavailable because no browser or cloud TTS provider is configured.",
            "text": text,
        }
