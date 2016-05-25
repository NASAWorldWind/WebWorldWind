/**
 * @source Henning Umland, http://www.celnav.de/longterm.htm
 * @exports sun
 */

define([
        '../geom/Angle'
    ],
    function (Angle) {
        "use strict";

        /**
         * Calculates the the sun position on the globe for a given date
         * @param {Date} date
         * @returns {Object} The latitude and longitude of the sun.
         */
        function sun(date) {

            var times = julianTime(date);
            var JD = times.JD;
            var T2 = times.T2;
            var T3 = times.T3;
            var Tau = times.Tau;
            var Tau2 = times.Tau2;
            var Tau3 = times.Tau3;
            var Tau4 = times.Tau4;
            var Tau5 = times.Tau5;
            var TE = times.TE;
            var TE2 = times.TE2;
            var TE3 = times.TE3;

            var angles = nutation(TE, TE2, TE3);
            var delta_psi = angles.delta_psi;
            var eps = angles.eps;

            var GHAAtrue = aries(JD, T2, T3, delta_psi, eps);

            var dtr = Angle.DEGREES_TO_RADIANS;
            var cos = Math.cos;

            //Periodic terms for the sun
            //Longitude
            var L0 = 175347046;
            L0 += 3341656 * cos(4.6692568 + 6283.0758500 * Tau);
            L0 += 34894 * cos(4.62610 + 12566.15170 * Tau);
            L0 += 3497 * cos(2.7441 + 5753.3849 * Tau);
            L0 += 3418 * cos(2.8289 + 3.5231 * Tau);
            L0 += 3136 * cos(3.6277 + 77713.7715 * Tau);
            L0 += 2676 * cos(4.4181 + 7860.4194 * Tau);
            L0 += 2343 * cos(6.1352 + 3930.2097 * Tau);
            L0 += 1324 * cos(0.7425 + 11506.7698 * Tau);
            L0 += 1273 * cos(2.0371 + 529.6910 * Tau);

            L0 += 1199 * cos(1.1096 + 1577.3435 * Tau);
            L0 += 990 * cos(5.233 + 5884.927 * Tau);
            L0 += 902 * cos(2.045 + 26.298 * Tau);
            L0 += 857 * cos(3.508 + 398.149 * Tau);
            L0 += 780 * cos(1.179 + 5223.694 * Tau);
            L0 += 753 * cos(2.533 + 5507.553 * Tau);
            L0 += 505 * cos(4.583 + 18849.228 * Tau);
            L0 += 492 * cos(4.205 + 775.523 * Tau);
            L0 += 357 * cos(2.920 + 0.067 * Tau);
            L0 += 317 * cos(5.849 + 11790.629 * Tau);

            L0 += 284 * cos(1.899 + 796.298 * Tau);
            L0 += 271 * cos(0.315 + 10977.079 * Tau);
            L0 += 243 * cos(0.345 + 5486.778 * Tau);
            L0 += 206 * cos(4.806 + 2544.314 * Tau);
            L0 += 205 * cos(1.869 + 5573.143 * Tau);
            L0 += 202 * cos(2.458 + 6069.777 * Tau);
            L0 += 156 * cos(0.833 + 213.299 * Tau);
            L0 += 132 * cos(3.411 + 2942.463 * Tau);
            L0 += 126 * cos(1.083 + 20.775 * Tau);
            L0 += 115 * cos(0.645 + 0.980 * Tau);

            L0 += 103 * cos(0.636 + 4694.003 * Tau);
            L0 += 102 * cos(0.976 + 15720.839 * Tau);
            L0 += 102 * cos(4.267 + 7.114 * Tau);
            L0 += 99 * cos(6.21 + 2146.17 * Tau);
            L0 += 98 * cos(0.68 + 155.42 * Tau);
            L0 += 86 * cos(5.98 + 161000.69 * Tau);
            L0 += 85 * cos(1.30 + 6275.96 * Tau);
            L0 += 85 * cos(3.67 + 71430.70 * Tau);
            L0 += 80 * cos(1.81 + 17260.15 * Tau);
            L0 += 79 * cos(3.04 + 12036.46 * Tau);

            L0 += 75 * cos(1.76 + 5088.63 * Tau);
            L0 += 74 * cos(3.50 + 3154.69 * Tau);
            L0 += 74 * cos(4.68 + 801.82 * Tau);
            L0 += 70 * cos(0.83 + 9437.76 * Tau);
            L0 += 62 * cos(3.98 + 8827.39 * Tau);
            L0 += 61 * cos(1.82 + 7084.90 * Tau);
            L0 += 57 * cos(2.78 + 6286.60 * Tau);
            L0 += 56 * cos(4.39 + 14143.50 * Tau);
            L0 += 56 * cos(3.47 + 6279.55 * Tau);
            L0 += 52 * cos(0.19 + 12139.55 * Tau);

            L0 += 52 * cos(1.33 + 1748.02 * Tau);
            L0 += 51 * cos(0.28 + 5856.48 * Tau);
            L0 += 49 * cos(0.49 + 1194.45 * Tau);
            L0 += 41 * cos(5.37 + 8429.24 * Tau);
            L0 += 41 * cos(2.40 + 19651.05 * Tau);
            L0 += 39 * cos(6.17 + 10447.39 * Tau);
            L0 += 37 * cos(6.04 + 10213.29 * Tau);
            L0 += 37 * cos(2.57 + 1059.38 * Tau);
            L0 += 36 * cos(1.71 + 2352.87 * Tau);
            L0 += 36 * cos(1.78 + 6812.77 * Tau);

            L0 += 33 * cos(0.59 + 17789.85 * Tau);
            L0 += 30 * cos(0.44 + 83996.85 * Tau);
            L0 += 30 * cos(2.74 + 1349.87 * Tau);
            L0 += 25 * cos(3.16 + 4690.48 * Tau);


            var L1 = 628331966747;
            L1 += 206059 * cos(2.678235 + 6283.075850 * Tau);
            L1 += 4303 * cos(2.6351 + 12566.1517 * Tau);
            L1 += 425 * cos(1.590 + 3.523 * Tau);
            L1 += 119 * cos(5.796 + 26.298 * Tau);
            L1 += 109 * cos(2.966 + 1577.344 * Tau);
            L1 += 93 * cos(2.59 + 18849.23 * Tau);
            L1 += 72 * cos(1.14 + 529.69 * Tau);
            L1 += 68 * cos(1.87 + 398.15 * Tau);
            L1 += 67 * cos(4.41 + 5507.55 * Tau);

            L1 += 59 * cos(2.89 + 5223.69 * Tau);
            L1 += 56 * cos(2.17 + 155.42 * Tau);
            L1 += 45 * cos(0.40 + 796.30 * Tau);
            L1 += 36 * cos(0.47 + 775.52 * Tau);
            L1 += 29 * cos(2.65 + 7.11 * Tau);
            L1 += 21 * cos(5.34 + 0.98 * Tau);
            L1 += 19 * cos(1.85 + 5486.78 * Tau);
            L1 += 19 * cos(4.97 + 213.30 * Tau);
            L1 += 17 * cos(2.99 + 6275.96 * Tau);
            L1 += 16 * cos(0.03 + 2544.31 * Tau);

            L1 += 16 * cos(1.43 + 2146.17 * Tau);
            L1 += 15 * cos(1.21 + 10977.08 * Tau);
            L1 += 12 * cos(2.83 + 1748.02 * Tau);
            L1 += 12 * cos(3.26 + 5088.63 * Tau);
            L1 += 12 * cos(5.27 + 1194.45 * Tau);
            L1 += 12 * cos(2.08 + 4694.00 * Tau);
            L1 += 11 * cos(0.77 + 553.57 * Tau);
            L1 += 10 * cos(1.30 + 6286.60 * Tau);
            L1 += 10 * cos(4.24 + 1349.87 * Tau);
            L1 += 9 * cos(2.70 + 242.73 * Tau);

            L1 += 9 * cos(5.64 + 951.72 * Tau);
            L1 += 8 * cos(5.30 + 2352.87 * Tau);
            L1 += 6 * cos(2.65 + 9437.76 * Tau);
            L1 += 6 * cos(4.67 + 4690.48 * Tau);


            var L2 = 52919;
            L2 += 8720 * cos(1.0721 + 6283.0758 * Tau);
            L2 += 309 * cos(0.867 + 12566.152 * Tau);
            L2 += 27 * cos(0.05 + 3.52 * Tau);
            L2 += 16 * cos(5.19 + 26.30 * Tau);
            L2 += 16 * cos(3.68 + 155.42 * Tau);
            L2 += 10 * cos(0.76 + 18849.23 * Tau);
            L2 += 9 * cos(2.06 + 77713.77 * Tau);
            L2 += 7 * cos(0.83 + 775.52 * Tau);
            L2 += 5 * cos(4.66 + 1577.34 * Tau);

            L2 += 4 * cos(1.03 + 7.11 * Tau);
            L2 += 4 * cos(3.44 + 5573.14 * Tau);
            L2 += 3 * cos(5.14 + 796.30 * Tau);
            L2 += 3 * cos(6.05 + 5507.55 * Tau);
            L2 += 3 * cos(1.19 + 242.73 * Tau);
            L2 += 3 * cos(6.12 + 529.69 * Tau);
            L2 += 3 * cos(0.31 + 398.15 * Tau);
            L2 += 3 * cos(2.28 + 553.57 * Tau);
            L2 += 2 * cos(4.38 + 5223.69 * Tau);
            L2 += 2 * cos(3.75 + 0.98 * Tau);


            var L3 = 289 * cos(5.844 + 6283.076 * Tau);
            L3 += 35;
            L3 += 17 * cos(5.49 + 12566.15 * Tau);
            L3 += 3 * cos(5.20 + 155.42 * Tau);
            L3 += cos(4.72 + 3.52 * Tau);
            L3 += cos(5.30 + 18849.23 * Tau);
            L3 += cos(5.97 + 242.73 * Tau);


            var L4 = 114 * cos(3.142);
            L4 += 8 * cos(4.13 + 6283.08 * Tau);
            L4 += cos(3.84 + 12566.15 * Tau);


            var L5 = cos(3.14);

            //Mean longitude of the sun
            //var Lsun_mean = trunc(280.4664567 + 360007.6982779 * Tau + 0.03032028 * Tau2 + Tau3 / 49931 - Tau4 / 15299 - Tau5 / 1988000);

            //Heliocentric longitude
            var Lhelioc = trunc((L0 + L1 * Tau + L2 * Tau2 + L3 * Tau3 + L4 * Tau4 + L5 * Tau5) / 1e8 / dtr);

            //Geocentric longitude
            var Lsun_true = trunc(Lhelioc + 180 - 0.000025);

            //Latitude
            var B0 = 280 * cos(3.199 + 84334.662 * Tau);
            B0 += 102 * cos(5.422 + 5507.553 * Tau);
            B0 += 80 * cos(3.88 + 5223.69 * Tau);
            B0 += 44 * cos(3.70 + 2352.87 * Tau);
            B0 += 32 * cos(4.00 + 1577.34 * Tau);

            var B1 = 9 * cos(3.90 + 5507.55 * Tau);
            B1 += 6 * cos(1.73 + 5223.69 * Tau);

            //Heliocentric latitude
            var B = (B0 + B1 * Tau) / 1e8 / dtr;

            //Geocentric latitude
            var beta = trunc(-B);

            //Corrections
            var Lsun_prime = trunc(Lhelioc + 180 - 1.397 * TE - 0.00031 * TE2);

            beta = beta + 0.000011 * (cosd(Lsun_prime) - sind(Lsun_prime));

            //Distance earth-sun
            var R0 = 100013989;
            R0 += 1670700 * cos(3.0984635 + 6283.0758500 * Tau);
            R0 += 13956 * cos(3.05525 + 12566.15170 * Tau);
            R0 += 3084 * cos(5.1985 + 77713.7715 * Tau);
            R0 += 1628 * cos(1.1739 + 5753.3849 * Tau);
            R0 += 1576 * cos(2.8469 + 7860.4194 * Tau);
            R0 += 925 * cos(5.453 + 11506.770 * Tau);
            R0 += 542 * cos(4.564 + 3930.210 * Tau);
            R0 += 472 * cos(3.661 + 5884.927 * Tau);
            R0 += 346 * cos(0.964 + 5507.553 * Tau);

            R0 += 329 * cos(5.900 + 5223.694 * Tau);
            R0 += 307 * cos(0.299 + 5573.143 * Tau);
            R0 += 243 * cos(4.273 + 11790.629 * Tau);
            R0 += 212 * cos(5.847 + 1577.344 * Tau);
            R0 += 186 * cos(5.022 + 10977.079 * Tau);
            R0 += 175 * cos(3.012 + 18849.228 * Tau);
            R0 += 110 * cos(5.055 + 5486.778 * Tau);
            R0 += 98 * cos(0.89 + 6069.78 * Tau);
            R0 += 86 * cos(5.69 + 15720.84 * Tau);
            R0 += 86 * cos(1.27 + 161000.69 * Tau);

            R0 += 65 * cos(0.27 + 17260.15 * Tau);
            R0 += 63 * cos(0.92 + 529.69 * Tau);
            R0 += 57 * cos(2.01 + 83996.85 * Tau);
            R0 += 56 * cos(5.24 + 71430.70 * Tau);
            R0 += 49 * cos(3.25 + 2544.31 * Tau);
            R0 += 47 * cos(2.58 + 775.52 * Tau);
            R0 += 45 * cos(5.54 + 9437.76 * Tau);
            R0 += 43 * cos(6.01 + 6275.96 * Tau);
            R0 += 39 * cos(5.36 + 4694.00 * Tau);
            R0 += 38 * cos(2.39 + 8827.39 * Tau);

            R0 += 37 * cos(0.83 + 19651.05 * Tau);
            R0 += 37 * cos(4.90 + 12139.55 * Tau);
            R0 += 36 * cos(1.67 + 12036.46 * Tau);
            R0 += 35 * cos(1.84 + 2942.46 * Tau);
            R0 += 33 * cos(0.24 + 7084.90 * Tau);
            R0 += 32 * cos(0.18 + 5088.63 * Tau);
            R0 += 32 * cos(1.78 + 398.15 * Tau);
            R0 += 28 * cos(1.21 + 6286.60 * Tau);
            R0 += 28 * cos(1.90 + 6279.55 * Tau);
            R0 += 26 * cos(4.59 + 10447.39 * Tau);


            var R1 = 103019 * cos(1.107490 + 6283.075850 * Tau);
            R1 += 1721 * cos(1.0644 + 12566.1517 * Tau);
            R1 += 702 * cos(3.142);
            R1 += 32 * cos(1.02 + 18849.23 * Tau);
            R1 += 31 * cos(2.84 + 5507.55 * Tau);
            R1 += 25 * cos(1.32 + 5223.69 * Tau);
            R1 += 18 * cos(1.42 + 1577.34 * Tau);
            R1 += 10 * cos(5.91 + 10977.08 * Tau);
            R1 += 9 * cos(1.42 + 6275.96 * Tau);
            R1 += 9 * cos(0.27 + 5486.78 * Tau);


            var R2 = 4359 * cos(5.7846 + 6283.0758 * Tau);
            R2 += 124 * cos(5.579 + 12566.152 * Tau);
            R2 += 12 * cos(3.14);
            R2 += 9 * cos(3.63 + 77713.77 * Tau);
            R2 += 6 * cos(1.87 + 5573.14 * Tau);
            R2 += 3 * cos(5.47 + 18849.23 * Tau);


            var R3 = 145 * cos(4.273 + 6283.076 * Tau);
            R3 += 7 * cos(3.92 + 12566.15 * Tau);


            var R4 = 4 * cos(2.56 + 6283.08 * Tau);

            var R = (R0 + R1 * Tau + R2 * Tau2 + R3 * Tau3 + R4 * Tau4) / 1e8;


            //Apparent longitude of the sun
            var lambda = trunc(Lsun_true + delta_psi - 0.005691611 / R);

            //Right ascension of the sun, apparent
            var RAsun = trunc(Math.atan2((sind(lambda) * cosd(eps) - tand(beta) * sind(eps)), cosd(lambda)) / dtr);

            //Sidereal hour angle of the sun, apparent
            //var SHAsun = 360 - RAsun;

            //Declination of the sun, apparent (actual sun latitude)
            var DECsun = Math.asin(sind(beta) * cosd(eps) + cosd(beta) * sind(eps) * sind(lambda)) / dtr;

            //GHA of the sun (actual sun latitude)
            var GHAsun = trunc(GHAAtrue - RAsun);

            //Semidiameter of the sun
            //var SDsun = 959.63 / R;

            //Horizontal parallax of the sun
            //var HPsun = 8.794 / R;

            //Equation of time
            //EOT = 4*(Lsun_mean-0.0057183-0.0008-RAsun+delta_psi*cosd(eps));
            //var EOT = 4 * GHAsun + 720 - 1440 * dayfraction;
            //if (EOT > 20) EOT -= 1440;
            //if (EOT < -20) EOT += 1440;

            return {
                latitude: DECsun,
                longitude: 360 - GHAsun
            }

        }

        /**
         * Calculates Julian date, century, and millennium
         * @param {Date} date
         * @returns {Object} Julian date, century, and millennium.
         */
        function julianTime(date) {

            var year = date.getUTCFullYear();
            var month = date.getUTCMonth() + 1;
            var day = date.getUTCDate();
            var hour = date.getUTCHours();
            var minute = date.getUTCMinutes();
            var second = date.getUTCSeconds();

            //Delta T = 32.184 s + (TAI - UTC) - (UT1 - UTC)
            //http://maia.usno.navy.mil/ser7/deltat.data
            //for 2016 the value is 68.1577
            var deltaT = 68.1577;

            var dayfraction = (hour + minute / 60 + second / 3600) / 24;

            var JD0h, JD, JDE, T, T2, T3, T4, T5, TE, TE2, TE3, TE4, TE5, Tau, Tau2, Tau3, Tau4, Tau5;

            //Julian day (UT1)
            if (month <= 2) {
                year -= 1;
                month += 12;
            }
            var A = Math.floor(year / 100);
            var B = 2 - A + Math.floor(A / 4);
            JD0h = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
            JD = JD0h + dayfraction;

            //Julian centuries (GMT) since 2000 January 0.5
            T = (JD - 2451545) / 36525;
            T2 = T * T;
            T3 = T * T2;
            T4 = T * T3;
            T5 = T * T4;

            //Julian ephemeris day (TDT)
            JDE = JD + deltaT / 86400;

            //Julian centuries (TDT) from 2000 January 0.5
            TE = (JDE - 2451545) / 36525;
            TE2 = TE * TE;
            TE3 = TE * TE2;
            TE4 = TE * TE3;
            TE5 = TE * TE4;

            //Julian millenniums (TDT) from 2000 January 0.5
            Tau = 0.1 * TE;
            Tau2 = Tau * Tau;
            Tau3 = Tau * Tau2;
            Tau4 = Tau * Tau3;
            Tau5 = Tau * Tau4;

            return {
                JD: JD,
                T2: T2,
                T3: T3,
                Tau: Tau,
                Tau2: Tau2,
                Tau3: Tau3,
                Tau4: Tau4,
                Tau5: Tau5,
                TE: TE,
                TE2: TE2,
                TE3: TE3,
                TE4: TE4,
                TE5: TE5
            };

        }

        /**
         * Calculates the nutation
         * @param {Number} TE Julian centuries (TDT) from 2000 January 0.5
         * @param {Number} TE2 Julian centuries (TDT) from 2000 January 0.5
         * @param {Number} TE3 Julian centuries (TDT) from 2000 January 0.5
         * @returns {Object} Nutation in longitude and True obliquity of the ecliptic.
         */
        function nutation(TE, TE2, TE3) {
            //IAU 1980 nutation theory:
            //Mean anomaly of the moon
            var Mm = 134.962981389 + 198.867398056 * TE + trunc(477000 * TE) + 0.008697222222 * TE2 + TE3 / 56250;

            //Mean anomaly of the sun
            var M = 357.527723333 + 359.05034 * TE + trunc(35640 * TE) - 0.0001602777778 * TE2 - TE3 / 300000;

            //Mean distance of the moon from the ascending node
            var F = 93.271910277 + 82.017538055 * TE + trunc(483120 * TE) - 0.0036825 * TE2 + TE3 / 327272.7273;

            //Mean elongation of the moon
            var D = 297.850363055 + 307.11148 * TE + trunc(444960 * TE) - 0.001914166667 * TE2 + TE3 / 189473.6842;

            //Longitude of the ascending node of the moon
            var omega = 125.044522222 - 134.136260833 * TE - trunc(1800 * TE) + 0.002070833333 * TE2 + TE3 / 450000;

            //Periodic terms for nutation
            var nut = new Array(106);
            nut[0] = " 0 0 0 0 1-171996-174.2 92025 8.9 ";
            nut[1] = " 0 0 2-2 2 -13187  -1.6  5736-3.1 ";
            nut[2] = " 0 0 2 0 2  -2274  -0.2   977-0.5 ";
            nut[3] = " 0 0 0 0 2   2062   0.2  -895 0.5 ";
            nut[4] = " 0-1 0 0 0  -1426   3.4    54-0.1 ";
            nut[5] = " 1 0 0 0 0    712   0.1    -7 0.0 ";
            nut[6] = " 0 1 2-2 2   -517   1.2   224-0.6 ";
            nut[7] = " 0 0 2 0 1   -386  -0.4   200 0.0 ";
            nut[8] = " 1 0 2 0 2   -301   0.0   129-0.1 ";
            nut[9] = " 0-1 2-2 2    217  -0.5   -95 0.3 ";
            nut[10] = "-1 0 0 2 0    158   0.0    -1 0.0 ";
            nut[11] = " 0 0 2-2 1    129   0.1   -70 0.0 ";
            nut[12] = "-1 0 2 0 2    123   0.0   -53 0.0 ";
            nut[13] = " 1 0 0 0 1     63   0.1   -33 0.0 ";
            nut[14] = " 0 0 0 2 0     63   0.0    -2 0.0 ";
            nut[15] = "-1 0 2 2 2    -59   0.0    26 0.0 ";
            nut[16] = "-1 0 0 0 1    -58  -0.1    32 0.0 ";
            nut[17] = " 1 0 2 0 1    -51   0.0    27 0.0 ";
            nut[18] = "-2 0 0 2 0    -48   0.0     1 0.0 ";
            nut[19] = "-2 0 2 0 1     46   0.0   -24 0.0 ";
            nut[20] = " 0 0 2 2 2    -38   0.0    16 0.0 ";
            nut[21] = " 2 0 2 0 2    -31   0.0    13 0.0 ";
            nut[22] = " 2 0 0 0 0     29   0.0    -1 0.0 ";
            nut[23] = " 1 0 2-2 2     29   0.0   -12 0.0 ";
            nut[24] = " 0 0 2 0 0     26   0.0    -1 0.0 ";
            nut[25] = " 0 0 2-2 0    -22   0.0     0 0.0 ";
            nut[26] = "-1 0 2 0 1     21   0.0   -10 0.0 ";
            nut[27] = " 0 2 0 0 0     17  -0.1     0 0.0 ";
            nut[28] = " 0 2 2-2 2    -16   0.1     7 0.0 ";
            nut[29] = "-1 0 0 2 1     16   0.0    -8 0.0 ";
            nut[30] = " 0 1 0 0 1    -15   0.0     9 0.0 ";
            nut[31] = " 1 0 0-2 1    -13   0.0     7 0.0 ";
            nut[32] = " 0-1 0 0 1    -12   0.0     6 0.0 ";
            nut[33] = " 2 0-2 0 0     11   0.0     0 0.0 ";
            nut[34] = "-1 0 2 2 1    -10   0.0     5 0.0 ";
            nut[35] = " 1 0 2 2 2     -8   0.0     3 0.0 ";
            nut[36] = " 0-1 2 0 2     -7   0.0     3 0.0 ";
            nut[37] = " 0 0 2 2 1     -7   0.0     3 0.0 ";
            nut[38] = " 1 1 0-2 0     -7   0.0     0 0.0 ";
            nut[39] = " 0 1 2 0 2      7   0.0    -3 0.0 ";
            nut[40] = "-2 0 0 2 1     -6   0.0     3 0.0 ";
            nut[41] = " 0 0 0 2 1     -6   0.0     3 0.0 ";
            nut[42] = " 2 0 2-2 2      6   0.0    -3 0.0 ";
            nut[43] = " 1 0 0 2 0      6   0.0     0 0.0 ";
            nut[44] = " 1 0 2-2 1      6   0.0    -3 0.0 ";
            nut[45] = " 0 0 0-2 1     -5   0.0     3 0.0 ";
            nut[46] = " 0-1 2-2 1     -5   0.0     3 0.0 ";
            nut[47] = " 2 0 2 0 1     -5   0.0     3 0.0 ";
            nut[48] = " 1-1 0 0 0      5   0.0     0 0.0 ";
            nut[49] = " 1 0 0-1 0     -4   0.0     0 0.0 ";
            nut[50] = " 0 0 0 1 0     -4   0.0     0 0.0 ";
            nut[51] = " 0 1 0-2 0     -4   0.0     0 0.0 ";
            nut[52] = " 1 0-2 0 0      4   0.0     0 0.0 ";
            nut[53] = " 2 0 0-2 1      4   0.0    -2 0.0 ";
            nut[54] = " 0 1 2-2 1      4   0.0    -2 0.0 ";
            nut[55] = " 1 1 0 0 0     -3   0.0     0 0.0 ";
            nut[56] = " 1-1 0-1 0     -3   0.0     0 0.0 ";
            nut[57] = "-1-1 2 2 2     -3   0.0     1 0.0 ";
            nut[58] = " 0-1 2 2 2     -3   0.0     1 0.0 ";
            nut[59] = " 1-1 2 0 2     -3   0.0     1 0.0 ";
            nut[60] = " 3 0 2 0 2     -3   0.0     1 0.0 ";
            nut[61] = "-2 0 2 0 2     -3   0.0     1 0.0 ";
            nut[62] = " 1 0 2 0 0      3   0.0     0 0.0 ";
            nut[63] = "-1 0 2 4 2     -2   0.0     1 0.0 ";
            nut[64] = " 1 0 0 0 2     -2   0.0     1 0.0 ";
            nut[65] = "-1 0 2-2 1     -2   0.0     1 0.0 ";
            nut[66] = " 0-2 2-2 1     -2   0.0     1 0.0 ";
            nut[67] = "-2 0 0 0 1     -2   0.0     1 0.0 ";
            nut[68] = " 2 0 0 0 1      2   0.0    -1 0.0 ";
            nut[69] = " 3 0 0 0 0      2   0.0     0 0.0 ";
            nut[70] = " 1 1 2 0 2      2   0.0    -1 0.0 ";
            nut[71] = " 0 0 2 1 2      2   0.0    -1 0.0 ";
            nut[72] = " 1 0 0 2 1     -1   0.0     0 0.0 ";
            nut[73] = " 1 0 2 2 1     -1   0.0     1 0.0 ";
            nut[74] = " 1 1 0-2 1     -1   0.0     0 0.0 ";
            nut[75] = " 0 1 0 2 0     -1   0.0     0 0.0 ";
            nut[76] = " 0 1 2-2 0     -1   0.0     0 0.0 ";
            nut[77] = " 0 1-2 2 0     -1   0.0     0 0.0 ";
            nut[78] = " 1 0-2 2 0     -1   0.0     0 0.0 ";
            nut[79] = " 1 0-2-2 0     -1   0.0     0 0.0 ";
            nut[80] = " 1 0 2-2 0     -1   0.0     0 0.0 ";
            nut[81] = " 1 0 0-4 0     -1   0.0     0 0.0 ";
            nut[82] = " 2 0 0-4 0     -1   0.0     0 0.0 ";
            nut[83] = " 0 0 2 4 2     -1   0.0     0 0.0 ";
            nut[84] = " 0 0 2-1 2     -1   0.0     0 0.0 ";
            nut[85] = "-2 0 2 4 2     -1   0.0     1 0.0 ";
            nut[86] = " 2 0 2 2 2     -1   0.0     0 0.0 ";
            nut[87] = " 0-1 2 0 1     -1   0.0     0 0.0 ";
            nut[88] = " 0 0-2 0 1     -1   0.0     0 0.0 ";
            nut[89] = " 0 0 4-2 2      1   0.0     0 0.0 ";
            nut[90] = " 0 1 0 0 2      1   0.0     0 0.0 ";
            nut[91] = " 1 1 2-2 2      1   0.0    -1 0.0 ";
            nut[92] = " 3 0 2-2 2      1   0.0     0 0.0 ";
            nut[93] = "-2 0 2 2 2      1   0.0    -1 0.0 ";
            nut[94] = "-1 0 0 0 2      1   0.0    -1 0.0 ";
            nut[95] = " 0 0-2 2 1      1   0.0     0 0.0 ";
            nut[96] = " 0 1 2 0 1      1   0.0     0 0.0 ";
            nut[97] = "-1 0 4 0 2      1   0.0     0 0.0 ";
            nut[98] = " 2 1 0-2 0      1   0.0     0 0.0 ";
            nut[99] = " 2 0 0 2 0      1   0.0     0 0.0 ";
            nut[100] = " 2 0 2-2 1      1   0.0    -1 0.0 ";
            nut[101] = " 2 0-2 0 1      1   0.0     0 0.0 ";
            nut[102] = " 1-1 0-2 0      1   0.0     0 0.0 ";
            nut[103] = "-1 0 0 1 1      1   0.0     0 0.0 ";
            nut[104] = "-1-1 0 2 1      1   0.0     0 0.0 ";
            nut[105] = " 0 1 0 1 0      1   0.0     0 0.0 ";

            //Reading periodic terms
            var fMm, fM, fF, fD, f_omega, dp = 0, de = 0;

            for (var x = 0; x < 105; x++) {
                fMm = (+nut[x].substring(0, 2));
                fM = (+nut[x].substring(2, 4));
                fF = (+nut[x].substring(4, 6));
                fD = (+nut[x].substring(6, 8));
                f_omega = (+nut[x].substring(8, 10));
                dp += ((+nut[x].substring(10, 17)) + TE * (+nut[x].substring(17, 23))) * sind(fD * D + fM * M + fMm * Mm + fF * F + f_omega * omega);
                de += ((+nut[x].substring(23, 29)) + TE * (+nut[x].substring(29, 33))) * cosd(fD * D + fM * M + fMm * Mm + fF * F + f_omega * omega);
            }

            //Corrections (Herring, 1987)
            /*
             var corr = new Array(4);
             corr[0] = " 0 0 0 0 1-725 417 213 224 ";
             corr[1] = " 0 1 0 0 0 523  61 208 -24 ";
             corr[2] = " 0 0 2-2 2 102-118 -41 -47 ";
             corr[3] = " 0 0 2 0 2 -81   0  32   0 ";

             for (x=0; x<4; x++)
             {
             fMm = eval(corr[x].substring(0,2));
             fM = eval(corr[x].substring(2,4));
             fF = eval(corr[x].substring(4,6));
             fD = eval(corr[x].substring(6,8));
             f_omega = eval(corr[x].substring(8,10));
             dp += 0.1*(eval(corr[x].substring(10,14))*sind(fD*D+fM*M+fMm*Mm+fF*F+f_omega*omega)+eval(corr[x].substring(14,18))*cosd(fD*D+fM*M+fMm*Mm+fF*F+f_omega*omega));
             de += 0.1*(eval(corr[x].substring(18,22))*cosd(fD*D+fM*M+fMm*Mm+fF*F+f_omega*omega)+eval(corr[x].substring(22,26))*sind(fD*D+fM*M+fMm*Mm+fF*F+f_omega*omega));
             }
             */

            //Nutation in longitude
            var delta_psi = dp / 36000000;

            //Nutation in obliquity
            var delta_eps = de / 36000000;

            //Mean obliquity of the ecliptic
            var eps0 = (84381.448 - 46.815 * TE - 0.00059 * TE2 + 0.001813 * TE3) / 3600;

            //True obliquity of the ecliptic
            var eps = eps0 + delta_eps;

            return {
                delta_psi: delta_psi,
                eps: eps
            }
        }

        /**
         * Calculates the True GHA Aries
         * @param {Number} JD Julian date
         * @param {Number} T2 Julian centuries (GMT) since 2000 January 0.5
         * @param {Number} T3 Julian centuries (GMT) since 2000 January 0.5
         * @param {Number} delta_psi Nutation in longitude
         * @param {Number} eps True obliquity of the ecliptic
         * @returns {Object} Julian date, century, and millennium.
         */
        function aries(JD, T2, T3, delta_psi, eps) {
            //Mean GHA Aries
            var GHAAmean = trunc(280.46061837 + 360.98564736629 * (JD - 2451545) + 0.000387933 * T2 - T3 / 38710000);

            //True GHA Aries
            var GHAAtrue = trunc(GHAAmean + delta_psi * cosd(eps));

            return GHAAtrue;
        }

        /**
         * Calculates the sine of angles in degrees
         * @param {Number} x angle in degrees
         * @returns {Number} The sine of x
         */
        function sind(x) {
            return Math.sin(Angle.DEGREES_TO_RADIANS * x);
        }

        /**
         * Calculates the cosine of angles in degrees
         * @param {Number} x angle in degrees
         * @returns {Number} The cosine of x
         */
        function cosd(x) {
            return Math.cos(Angle.DEGREES_TO_RADIANS * x);
        }

        /**
         * Calculates the tangent of angles in degrees
         * @param {Number} x angle in degrees
         * @returns {Number} The tangent of x
         */
        function tand(x) {
            return Math.tan(Angle.DEGREES_TO_RADIANS * x);
        }

        /**
         * Converts a large angle to an angle between 0 and 359
         * @param {Number} x angle in degrees
         * @returns {Number} x an angle in degrees between 0 and 359
         */
        function trunc(x) {
            return 360 * (x / 360 - Math.floor(x / 360));
        }

        return sun;
    });