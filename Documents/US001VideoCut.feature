Feature: FFmpeg ile Video Kesme İşlemi

  Scenario: MP4 videosunun ilk 3 saniyesini alma
    Given "input.mp4" adında bir test videosu mevcut
    When Videonun ilk 3 saniyesi kesilip "output.mp4" ismiyle kaydedildiğinde
    Then "output.mp4" dosyası başarıyla oluşturulmuş olmalı

  Scenario: MP4 videosunun belirli aralıklarını alma
    Given "input.mp4" adında bir test videosu mevcut
    When Videonun 1 ile 5 saniyesi araligi kesilip "output2.mp4" ismiyle kaydedildiğinde
    Then "output2.mp4" dosyası başarıyla oluşturulmuş olmalı

  Scenario: MP4 videosundan birden fazla parçayı kesip birleştirme
    Given "input.mp4" adında bir test videosu mevcut
    When Videonun 1-5 ve 10-15 saniye araliklari kesilip tek parca "birlestirilmis.mp4" olarak kaydedildiginde
    Then "birlestirilmis.mp4" dosyasi basari ile olusmus olmalı

Feature: MP4 Videosundan 3 Aralığı Kesip Tek Videoda Birleştirme

  Scenario: MP4 videosunun 3 farklı aralığını kesip tek parça halinde birleştirme
    Given "input.mp4" adında bir test videosu mevcut
    When Videonun 1-4, 6-9 ve 11-14 saniye araliklari kesilip tek parca "birlestirilmis3.mp4" olarak kaydedildiginde
    Then "birlestirilmis3.mp4" dosyasi basari ile olusmus olmalı

Feature: MP4 Videosundan 4 Aralığı Kesip Tek Videoda Birleştirme

  Scenario: MP4 videosunun 4 farklı aralığını kesip tek parça halinde birleştirme
    Given "input.mp4" adında bir test videosu mevcut
    When Videonun 1-3, 5-7, 9-11 ve 13-15 saniye araliklari kesilip tek parca "birlestirilmis4.mp4" olarak kaydedildiginde
    Then "birlestirilmis4.mp4" dosyasi basari ile olusmus olmalı

  Scenario: MP4 videosunu birden fazla ayrı dosyaya bölme
    Given "input.mp4" adında bir test videosu mevcut
    When Videonun 1-5 araligi "parca1.mp4" ve 10-15 araligi "parca2.mp4" olarak ayrildiginda
    Then "parca1.mp4" dosyasi basari ile olusmus olmalı
    And "parca2.mp4" dosyasi basari ile olusmus olmalı



  Scenario: MP4 videosundan 3 farklı aralığı ayrı dosyalar olarak çıkarma
    Given "input.mp4" adında bir test videosu mevcut
    When Videonun 1-5 araligi "parca1.mp4", 7-11 araligi "parca2.mp4" ve 13-17 araligi "parca3.mp4" olarak ayrildiginda
    Then "parca1.mp4" dosyasi basari ile olusmus olmalı
    And "parca2.mp4" dosyasi basari ile olusmus olmalı
    And "parca3.mp4" dosyasi basari ile olusmus olmalı

Feature: MP4 Videosunu 4 Farklı Parçaya Bölme

  Scenario: MP4 videosundan 4 farklı aralığı ayrı dosyalar olarak çıkarma
    Given "input.mp4" adında bir test videosu mevcut
    When Videonun 1-4 araligi "parca1.mp4", 5-8 araligi "parca2.mp4", 9-12 araligi "parca3.mp4" ve 13-16 araligi "parca4.mp4" olarak ayrildiginda
    Then "parca1.mp4" dosyasi basari ile olusmus olmalı
    And "parca2.mp4" dosyasi basari ile olusmus olmalı
    And "parca3.mp4" dosyasi basari ile olusmus olmalı
    And "parca4.mp4" dosyasi basari ile olusmus olmalı