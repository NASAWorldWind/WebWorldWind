**Important notice:** Official NASA WorldWind development is suspended, beginning April 5th, 2019. This suspension 
also applies to the WorldWind geospatial data web services that operated at NASA Ames Research Center (ARC), and which 
are configured by default for geospatial data consumption in the WorldWind 3D globe (imagery, elevations
and place names). 

If your WorldWind-based application is not retrieving imagery or elevations, it may be that it's attempting to access
services at *.worldwind.arc.nasa.gov (you can use a network traffic monitoring tool to confirm if
that's the case).

A WorldWind-based application can be modified to retrieve from other geospatial web services in order to continue
operating without relying on NASA ARC geospatial data services. Throughout the source files you can look for references
to URLs in the form of `https://worldwind\d\d.arc.nasa.gov` (in regex notation) in order to find which features of 
WorldWind make use of NASA ARC services. For instance, ny elevations layer points either towards 
`https://worldwind26.arc.nasa.gov` or `https://data.worldwind.arc.nasa.gov/elev`.

More information about the suspension and general guidance into alternative geospatial data services that may be used
by WorldWind at the following link:
 
https://worldwind.arc.nasa.gov/news/2019-03-21-suspension-faq/

Issues will not be attended by the maintainers in the foreseeable future, but users are welcome to raise them for 
consideration in case that the project suspension is lifted at a later point in time. 

---

**Note:** Any issue that does not include enough information to be reviewed in a timely manner may be closed at the
maintainer's discretion.

### Prerequisites

Please fulfill the following requirements before submitting an issue to this repository.

- Check the "Common Problems" page on the WorldWind website: https://worldwind.arc.nasa.gov/web/tutorials/common-problems/
- Check that your issue isn't already filed: https://github.com/NASAWorldWind/WebWorldWind/issues
- Check the WorldWind forum for common solutions: https://forum.worldwindcentral.com/forum/web-world-wind/web-world-wind-help

### Description

[Description of the issue]

### Steps to Reproduce

1. [First step]
2. [Second step]
3. [and so on...]

**Expected behavior:** [What you expect to happen]

**Actual behavior:** [What actually happens]

**Reproduces how often:** [What percentage of the time does it reproduce?]

### Operating System and Version

[What operating system and version are you using?]

### Additional Information

Any additional information, configuration or data that might be necessary to reproduce the issue.