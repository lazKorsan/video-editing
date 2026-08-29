Feature: FFmpeg ile Video Sesi Yükseltme İşlemi

  Scenario: MP4 videosunun sesini istenen oranda artırmak
    Given "cucumberframeworkAppiumTestleri.mp4" adında bir test videosu mevcut
    When Video icindeki insan sesleri 15 katina cikarilip "cucumberframeworkAppiumTestleri12.mp4" kaydedildiginde
    Then "cucumberframeworkAppiumTestleri12.mp4" dosyasi basari ile olusmus olmalı