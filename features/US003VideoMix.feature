Feature: Klasör İçindeki Videoları Otomatik Birleştirme

  Scenario: Belirtilen klasördeki tüm MP4 videolarını isim sırasına göre tek parçada birleştirme
    Given "assets" klasoru icindeki tum videolarin mevcut oldugu teyit edildiginde
    When Klasordeki videolar "birlesik_film.mp4" ismiyle tek parca haline getirildiginde
    Then "birlesik_film.mp4" dosyasi basari ile olusmus olmalı