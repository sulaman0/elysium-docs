import React from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';
import { DocSearch } from '@docsearch/react';



export default function SearchSection() {
    const { algolia } = useThemeConfig();
    const { appId, apiKey, indexName } = algolia;
    return (
        <>


            <section className={'searchSectoin clients'}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-8 col-xxl-6 mx-auto d-flex flex-column">
                            <h2 className={'RadialGradient top-minus text-capitalize  text-center Fsize_48 ArchivoLight pb-3 text-shadow'}>Elysium <span
                                className={"ArchivoBold"}>Documentation</span></h2>
                            <p className={'pb-3 ArchivoExtraLight'}>Elysium documentation includes conceptual, procedural, and reference
                                information for blockchain builders and parachain project teams</p>
                            <div className={'my-searchBtn'}>
                                <DocSearch
                                    appId={appId}
                                    indexName={indexName}
                                    apiKey={apiKey}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}