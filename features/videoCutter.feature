Feature: MP4 Videosu Kesme ve Birleştirme İşlemleri

  Background:
    Given "test_video.mp4" adında bir test videosu mevcut

  Scenario: MP4 Videosundan 3 Aralığı Kesip Tek Videoda Birleştirme
    When Videonun 1-5, 7-11 ve 13-17 saniye araliklari kesilip tek parca "birlesik_3_parca.mp4" olarak kaydedildiginde
    Then "birlesik_3_parca.mp4" dosyasi basari ile olusmus olmalı

  Scenario: MP4 Videosundan 4 Aralığı Kesip Tek Videoda Birleştirme
    When Videonun 1-4, 5-8, 9-12 ve 13-16 saniye araliklari kesilip tek parca "birlesik_4_parca.mp4" olarak kaydedildiginde
    Then "birlesik_4_parca.mp4" dosyasi basari ile olusmus olmalı

  Scenario: MP4 Videosunu 4 Farklı Parçaya Bölme
    When Videonun 1-4 araligi "parca1.mp4", 5-8 araligi "parca2.mp4", 9-12 araligi "parca3.mp4" ve 13-16 araligi "parca4.mp4" olarak ayrildiginda
    Then "parca1.mp4" dosyasi basari ile olusmus olmalı
    And "parca2.mp4" dosyasi basari ile olusmus olmalı
    And "parca3.mp4" dosyasi basari ile olusmus olmalı
    And "parca4.mp4" dosyasi basari ile olusmus olmalı