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
    'src/ogc/openSearch/OpenSearchService'
], function (OpenSearchService) {
    "use strict";
    var openSearchService = new OpenSearchService();

    describe("Open Search Support", function(){
        describe("Discover", function(){
            var validDescriptionDocument;
            beforeAll(function(done){
                openSearchService.discover({url: '../base/test/ogc/openSearch/osDescription.xml'}).then(function(result){
                    validDescriptionDocument = result.descriptionDocument;
                    done();
                });
            });

            it('contains Short Name', function(){
                expect(validDescriptionDocument.shortName).toBe('FEDEO');
            });

            it('contains description', function(){
                expect(validDescriptionDocument.description).toBe('Provides interoperable access, following ISO/OGC interface guidelines, to Earth Observation metadata.');
            });

            describe('urls', function(){
                var first;

                beforeAll(function(){
                    first = validDescriptionDocument.urls[9];
                });

                it('contains 18 urls', function(){
                    expect(validDescriptionDocument.urls.length).toBe(18);
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

                    it('contains template', function(){
                        expect(first.template).toBe('http://fedeo.esa.int/opensearch/request/?httpAccept=application%2Fgeo%2Bjson&parentIdentifier={eo:parentIdentifier}&query={searchTerms?}&startRecord={startIndex?}&startPage={startPage?}&maximumRecords={count?}&startDate={time:start?}&endDate={time:end?}&bbox={geo:box?}&name={geo:name?}&lat={geo:lat?}&lon={geo:lon?}&radius={geo:radius?}&uid={geo:uid?}');
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

        describe("Search", function(){

        });
    })
});
