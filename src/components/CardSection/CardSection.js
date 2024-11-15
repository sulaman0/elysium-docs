import React from 'react';
import Cards from '../Cards/Card'
import Rocket from '../../../static/images/card-rocket.png'
import Community from '../../../static/images/card-community.png'
import Refrence from '../../../static/images/card-refrence.png'

export default function CardSection() {
    const data = [
        {
            image: Refrence,
            title: 'Building on Elysium',
            description: 'Learn how to build a new application or deploy existing Solidity smart contracts to Elysium.',
            list: [
                "How to get API endpoint for Elysium",
                // "How to use Ethereum tools to send transactions & deploy contracts",
                // "Learn More",
            ],
            links: [
                'docs/network-endpoints',
                // 'docs/etherum-vs-elysium/balance-transfer',
                // 'docs/intro',
            ]
        },
        {
            image: Community,
            title: 'Operating a Node',
            description: 'Everything you need to know about running a node on Elysium, how to become a collator, and more.',
            list: [
                "How to set up a Elysium Node",
                // "Learn about the collator requirements and how to spin up a collator node",
                // "Learn More",
            ],
            links: [
                'docs/node-operator/validator-node',
                // 'docs/validator-node#the-easiest-way-using-docker',
                // 'feeeas',
            ]
        },
        {
            image: Rocket,
            title: 'Learning About Elysium',
            description: 'Dive into the Elysium and learn what makes this approach to Ethereum compatability so compelling.',
            list: [
                "Learn More",
                // "Explore the DApp directory",
                // "Learn More"
            ],
            links: [
                'docs/intro',
            ]
        },
    ]

    return (
        <>
            <section className="cardsection">
                <div className="container">
                    <div className="row">
                        {
                            data.map((data) => {
                                return (
                                    <div  key={data.title} className="col-12 col-md-6 col-lg-4 mb-3">
                                        <Cards image={data.image} title={data.title} description={data.description}
                                               list={data.list} href={data.links}/>
                                    </div>
                                )

                            })
                        }

                    </div>
                </div>
            </section>
        </>
    )
}