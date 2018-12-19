/*
 * Copyright 2018 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([
    'src/ogc/openSearch/OpenSearchConstants',
    'src/ogc/openSearch/OpenSearchService'
], function (OpenSearchConstants,
             OpenSearchService) {
    "use strict";
    var openSearchService;

    describe("Open Search Support - GeoJSON collections, products", function(){
        var validDescriptionDocument,
            validCollectionsDocument,
            validProductsDocument;

        beforeAll(function(done){
            var service;
            OpenSearchService.create({url: '../base/test/ogc/openSearch/osDescriptionGeoJson.xml'}).then(function(result){
                service = result;
                validDescriptionDocument = result.descriptionDocument;
                return service.search([
                    {name: 'startRecord', value: '1'},
                    {name: 'maximumRecords', value: '10'},
                    {name: 'recordSchema', value: 'server-choice'},
                    {name: 'platform', value: 'spot'},
                    {name: 'instrument', value: 'HRVIR1'}
                ], {relation: OpenSearchConstants.COLLECTION})
            }).then(function(result){
                validCollectionsDocument = result;
                return service.search([
                    {name: 'parentIdentifier', value: 'TropForest'},
                    {name: 'recordSchema', value: 'server-choice'},
                    {name: 'platform', value: 'ALOS'}
                ]);
            }).then(function(result){
                validProductsDocument = result;
                done();
            }).catch(function(err){
                fail(err);
                done(err);
            })
        });

        describe("Discover", function(){
            it('contains Short Name', function(){
                expect(validDescriptionDocument.shortName).toBe('FEDEO');
            });

            it('contains description', function(){
                expect(validDescriptionDocument.description).toBe('Provides interoperable access, following ISO/OGC interface guidelines, to Earth Observation metadata.');
            });

            describe('urls', function(){
                var first;

                beforeAll(function(){
                    first = validDescriptionDocument.urls[0];
                });

                it('contains 2 urls', function(){
                    expect(validDescriptionDocument.urls.length).toBe(2);
                });

                describe('first', function(){
                    it('contains type', function(){
                        expect(first.type).toBe('application/geo+json');
                    });

                    it('contains method', function(){
                        expect(first.method).toBe('GET');
                    });

                    it('contains encType', function(){
                        expect(first.encType).toBe('application/x-www-form-urlencoded');
                    });

                    describe('parameters', function () {
                        var firstParam;
                        beforeAll(function(){
                            firstParam = first.parameters[0];
                        });

                        it('contains 17 parameters', function(){
                            expect(first.parameters.length).toBe(17);
                        });

                        describe('first', function(){
                            it('contains name', function(){
                                expect(firstParam.name).toBe('parentIdentifier');
                            });

                            it('contains value', function(){
                                expect(firstParam.value).toBe('parentIdentifier');
                            });

                            it('contains required', function(){
                                expect(firstParam.required).toBe(true);
                            });

                            it('contains replaceable', function(){
                                expect(firstParam.replaceable).toBe(true);
                            });

                            it('contains ns', function(){
                                expect(firstParam.ns).toBe('eo');
                            });
                        })
                    });

                    it('contains index offset', function(){
                        expect(first.indexOffset).toBe(1);
                    });

                    it('contains page offset', function(){
                        expect(first.pageOffset).toBe(1);
                    });

                    describe('relations', function(){
                        it('contains one', function(){
                            expect(first.relations.length).toBe(1);
                        });

                        it('is results', function(){
                            expect(first.relations[0]).toBe('results');
                        })
                    });

                    describe('paramsByName', function(){
                        var query;
                        beforeAll(function(){
                            query = first.paramsByName['query'];
                        });

                        it('contains 17 parameters', function(){
                            expect(Object.keys(first.paramsByName).length).toBe(17);
                        });

                        describe('query', function(){
                            it('contains name', function(){
                                expect(query.name).toBe('query');
                            });

                            it('contains value', function(){
                                expect(query.value).toBe('searchTerms');
                            });

                            it('contains required', function(){
                                expect(query.required).toBe(false);
                            });

                            it('contains replaceable', function(){
                                expect(query.replaceable).toBe(true);
                            });

                            it('contains empty namespace', function(){
                                expect(query.ns).toBe('');
                            });

                            it('contains minimum', function(){
                                expect(query.minimum).toBe(1);
                            });

                            it('contains maximum', function(){
                                expect(query.maximum).toBe(1);
                            });

                            it('contains title', function(){
                                expect(query.title).toBe('Textual search in the title, abstract or keyword section of the collection. Surround with double quotes for exact match.');
                            })
                        })
                    });

                    describe('staticParams', function(){
                        var firstParam;
                        beforeAll(function(){
                            firstParam = first.staticParams[0];
                        });

                        it('contains one', function(){
                            expect(first.staticParams.length).toBe(1);
                        });

                        describe('first', function(){
                            it('contains name', function(){
                                expect(firstParam.name).toBe('httpAccept');
                            });

                            it('contains value', function(){
                                expect(firstParam.value).toBe('application%2Fgeo%2Bjson');
                            });

                            it('contains require', function(){
                                expect(firstParam.required).toBe(true);
                            });

                            it('contains replaceable', function(){
                                expect(firstParam.replaceable).toBe(false);
                            });

                            it('contains empty ns', function(){
                                expect(firstParam.ns).toBe('');
                            });
                        })
                    });
                });
            });

            it('contains empty contact', function(){
                expect(validDescriptionDocument.contact).toBe('');
            });

            it('contains tags', function(){
                expect(validDescriptionDocument.tags).toBe('FEDEO, ESA, Earth Observation, Digital Repository, HMA, HMA-S, HMA-SE, CEOS-OS-BP-V1.1/L1.');
            });

            it('contains long name', function(){
                expect(validDescriptionDocument.longName).toBe('Earth Observation Catalogue');
            });

            describe('images', function(){
                var first, second;
                beforeAll(function(){
                    first = validDescriptionDocument.images[0];
                    second = validDescriptionDocument.images[1];
                });

                it('contains two', function(){
                    expect(validDescriptionDocument.images.length).toBe(2);
                });

                describe('first', function(){
                    it('contains height', function(){
                        expect(first.height).toBe(64);
                    });

                    it('contains width', function(){
                        expect(first.width).toBe(64);
                    });

                    it('contains type', function(){
                        expect(first.type).toBe('image/png');
                    });

                    it('contains src', function(){
                        expect(first.src).toBe('http://fedeo.esa.int/opensearch/images/esa_favicon.ico');
                    })
                });

                describe('second', function(){
                    it('contains height', function(){
                        expect(second.height).toBe(16);
                    });

                    it('contains width', function(){
                        expect(second.width).toBe(16);
                    });

                    it('contains type', function(){
                        expect(second.type).toBe('image/vnd.microsoft.icon');
                    });

                    it('contains src', function(){
                        expect(second.src).toBe('http://fedeo.esa.int/opensearch/images/esa_favicon.ico');
                    })
                });
            });

            describe('queries', function(){
                var first, second, third;
                beforeAll(function(){
                    first = validDescriptionDocument.queries[0];
                    second = validDescriptionDocument.queries[1];
                    third = validDescriptionDocument.queries[2];
                });

                it('contains three', function(){
                    expect(validDescriptionDocument.queries.length).toBe(3);
                });

                describe('first', function(){
                    it('contains parent identifier', function(){
                        expect(first["eo:parentIdentifier"]).toBe('TropForest');
                    });

                    it('contains role', function(){
                        expect(first.role).toBe('example');
                    });

                    it('contains end', function(){
                        expect(first['time:end']).toBe('2009-04-10T00:00:00Z');
                    });

                    it('contains start', function(){
                        expect(first['time:start']).toBe('2009-04-01T00:00:00Z');
                    });
                });

                describe('second', function(){
                    it('contains parent identifier', function(){
                        expect(second["eo:parentIdentifier"]).toBe('EOP:JAXA:CATS-I');
                    });

                    it('contains role', function(){
                        expect(second.role).toBe('example');
                    });
                });

                describe('third', function(){
                    it('contains platform', function(){
                        expect(third["eo:platform"]).toBe('Envisat');
                    });

                    it('contains role', function(){
                        expect(third.role).toBe('example');
                    });
                });
            });

            it('contains developer', function(){
                expect(validDescriptionDocument.developer).toBe('Spacebel s.a.');
            });

            it('contains attribution', function(){
                expect(validDescriptionDocument.attribution).toBe('Copyright 2017-2018, European Space Agency.');
            });

            it('contains syndication right', function(){
                expect(validDescriptionDocument.syndicationRight).toBe('open');
            });

            it('contains adult content info', function(){
                expect(validDescriptionDocument.adultContent).toBe(false);
            });

            describe('languages', function(){
                it('contains one', function(){
                    expect(validDescriptionDocument.languages.length).toBe(1);
                });

                it('is en-us', function(){
                    expect(validDescriptionDocument.languages[0]).toBe('en-us');
                });
            });

            describe('input encodings', function(){
                it('contains one', function(){
                    expect(validDescriptionDocument.inputEncodings.length).toBe(1);
                });

                it('is UTF-8', function(){
                    expect(validDescriptionDocument.inputEncodings[0]).toBe('UTF-8');
                });
            });

            describe('output encodings', function(){
                it('contains one', function(){
                    expect(validDescriptionDocument.outputEncodings.length).toBe(1);
                });

                it('is UTF-8', function(){
                    expect(validDescriptionDocument.outputEncodings[0]).toBe('UTF-8');
                });
            });
        });

        describe("Search Collections", function(){
            it('contains totalResults', function(){
                expect(validCollectionsDocument.totalResults).toBe(1);
            });

            it('contains startIndex', function(){
                expect(validCollectionsDocument.startIndex).toBe(1);
            });

            it('contains itemsPerPage', function(){
                expect(validCollectionsDocument.itemsPerPage).toBe(10);
            });

            describe('properties', function(){
                it('contains creator', function(){
                    expect(validCollectionsDocument.properties.creator).toBe('FEDEO Clearinghouse');
                });

                it('contains rights', function(){
                    expect(validCollectionsDocument.properties.rights).toBe('Copyright 2016-2018, European Space Agency');
                });

                it('contains title', function(){
                    expect(validCollectionsDocument.properties.title).toBe('FEDEO Clearinghouse - Search Response');
                });

                describe('links', function(){
                    it('contains first', function(){
                        expect(validCollectionsDocument.properties.links.first[0].href).toBe('http://fedeo.esa.int/opensearch/request/?httpAccept=application%2Fgeo%2Bjson&maximumRecords=10&recordSchema=server-choice&platform=spot&instrument=HRVIR1&startRecord=1&status=1,0');
                    });

                    it('contains last', function(){
                        expect(validCollectionsDocument.properties.links.last[0].href).toBe('http://fedeo.esa.int/opensearch/request/?httpAccept=application%2Fgeo%2Bjson&maximumRecords=10&recordSchema=server-choice&platform=spot&instrument=HRVIR1&startRecord=1&status=1,0');
                    });

                    it('contains search', function(){
                        expect(validCollectionsDocument.properties.links.search[0].href).toBe('http://fedeo.esa.int/opensearch/description.xml');
                    });
                })
            });

            describe('features', function(){
                var first;
                beforeAll(function(){
                    first = validCollectionsDocument.features[0];
                });

                it('contains 1 feature', function(){
                    expect(validCollectionsDocument.features.length).toBe(1);
                });

                describe('first', function(){
                    it('contains id', function(){
                        expect(first.id).toBe('http://fedeo.esa.int/opensearch/request/?httpAccept=application/geo%2Bjson&parentIdentifier=EOP%3AESA%3AFEDEO%3ACOLLECTIONS&uid=EOP%3ACNES%3ATHEIA%3ASpotWorldHeritage');
                    });

                    it('contains type', function(){
                        expect(first.type).toBe('Feature');
                    });

                    describe('properties', function(){
                        it('contains title', function(){
                            expect(first.properties.title).toBe('SpotWorldHeritage (Theia)');
                        });

                        it('contains identifier', function(){
                            expect(first.properties.identifier).toBe('EOP:CNES:THEIA:SpotWorldHeritage');
                        });

                        describe('categories', function(){
                            it('contains 13 categories', function(){
                                expect(first.properties.categories.length).toBe(19);
                            });

                            describe('first', function(){
                                var firstCategory;
                                beforeAll(function(){
                                    firstCategory = first.properties.categories[0];
                                });

                                it('has label', function(){
                                    expect(firstCategory.label).toBe('Geology');
                                });

                                it('has term', function(){
                                    expect(firstCategory.term).toBe('http://www.eionet.europa.eu/gemet/concept/3650');
                                });
                            });
                        });
                    });

                    describe('links', function(){
                        describe('alternates', function(){
                            it('contains the 10 alternates', function(){
                                expect(first.properties.links.alternates.length).toBe(10);
                            });
                        });

                        describe('search', function(){
                            it('contains href', function(){
                                expect(first.properties.links.search[0].href).toBe('http://fedeo.esa.int/opensearch/description.xml?parentIdentifier=EOP:CNES:THEIA:SpotWorldHeritage&sensorType=OPTICAL&subject=SpotWorldHeritage');
                            })
                        });

                        describe('previews', function(){
                            it('contains href', function(){
                                expect(first.properties.links.previews[0].href).toBe('http://131.176.197.12/opensearch/images/cnes.png');
                            })
                        });
                    });
                })
            });
        });

        describe("Search Products", function(){
            it('contains type', function(){
                expect(validProductsDocument.type).toBe('FeatureCollection');
            });

            it('contains total results', function(){
                expect(validProductsDocument.totalResults).toBe(1665);
            });

            it('contains items per page', function(){
                expect(validProductsDocument.itemsPerPage).toBe(10);
            });

            it('contains start index', function(){
                expect(validProductsDocument.startIndex).toBe(1);
            });

            describe('properties', function(){
                it('contains creator', function(){
                    expect(validProductsDocument.properties.creator).toBe('FEDEO Clearinghouse');
                });

                it('contains rights', function(){
                    expect(validProductsDocument.properties.rights).toBe('Copyright 2016-2018, European Space Agency');
                });

                it('contains title', function(){
                    expect(validProductsDocument.properties.title).toBe('FEDEO Clearinghouse - Search Response');
                });

                describe('links', function(){
                    it('contains first', function(){
                        expect(validProductsDocument.properties.links.first[0].href).toBe('http://fedeo.esa.int/opensearch/request/?httpAccept=application%2Fgeo%2Bjson&parentIdentifier=TropForest&recordSchema=server-choice&platform=ALOS&startRecord=1');
                    });

                    it('contains next', function(){
                        expect(validProductsDocument.properties.links.next[0].href).toBe('http://fedeo.esa.int/opensearch/request/?httpAccept=application%2Fgeo%2Bjson&parentIdentifier=TropForest&recordSchema=server-choice&platform=ALOS&startRecord=11');
                    });

                    it('contains last', function(){
                        expect(validProductsDocument.properties.links.last[0].href).toBe('http://fedeo.esa.int/opensearch/request/?httpAccept=application%2Fgeo%2Bjson&parentIdentifier=TropForest&recordSchema=server-choice&platform=ALOS&startRecord=1661');
                    });

                    it('contains search', function(){
                        expect(validProductsDocument.properties.links.search[0].href).toBe('http://fedeo.esa.int/opensearch/description.xml?parentIdentifier=TropForest');
                    })
                })
            });
        });
    })
});
