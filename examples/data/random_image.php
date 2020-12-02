<?php
 /**
 * Copyright 2006-2009, 2017, 2020 United States Government, as represented by the
 * Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 * 
 * The NASA World Wind Java (WWJ) platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 * 
 * NASA World Wind Java (WWJ) also contains the following 3rd party Open Source
 * software:
 * 
 *     Jackson Parser – Licensed under Apache 2.0
 *     GDAL – Licensed under MIT
 *     JOGL – Licensed under  Berkeley Software Distribution (BSD)
 *     Gluegen – Licensed under Berkeley Software Distribution (BSD)
 * 
 * A complete listing of 3rd Party software notices and licenses included in
 * NASA World Wind Java (WWJ)  can be found in the WorldWindJava-v2.2 3rd-party
 * notices and licenses PDF found in code directory.
  */

 /**
  * Generate an image that contains a random number. This script
  * is intended for testing KML Icon updates. It provides a
  * source of constantly changing images, so that the tester
  * can confirm that the link is actually updating.
  *
  * $Id$
  */

$im = imagecreatetruecolor(128, 128);
$text_color = imagecolorallocate($im, 233, 14, 91);
imagestring($im, 1, 5, 5, 'The number below should', $text_color);
imagestring($im, 1, 5, 15, 'change when the link', $text_color);
imagestring($im, 1, 7, 25, 'updates', $text_color);
$t=strval(rand(0,100));
imagestring($im, 4, 60, 64,  $t, $text_color);

// Set the content type header - in this case image/jpeg
header('Content-Type: image/jpeg');
// header("Cache-Control: max-age=1, must-revalidate");

// Output the image in JPEG format
imagejpeg($im);
imagedestroy($im);
?>
