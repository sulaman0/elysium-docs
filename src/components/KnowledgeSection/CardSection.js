import React from 'react';
import Logo from '../../../static/images/Footer Group 2.png'
import Cards from '../KnowledgeCard/KnowledgeCard'
import KN1 from '../../../static/images/kn-1-card.png'
import KN2 from '../../../static/images/kn-2-card.png'
import KN3 from '../../../static/images/kn-3-card.png'
import KN4 from '../../../static/images/kn-4-card.png'
import KN5 from '../../../static/images/kn-5-card.png'
import KN6 from '../../../static/images/kn-6-card.png'
import KN7 from '../../../static/images/kn-7-card.png'
import KN8 from '../../../static/images/kn-8-card.png'
import Link from "@docusaurus/core/lib/client/exports/Link";

export default function CardSection() {
    const data = [
        {
            image: KN1,
            title: 'Get Started',
            description: 'Elysium is a fully Ethereum-compatible.',
            url:'docs/intro'
        },
        {
            image: KN2,
            title: 'Networks',
            description: 'Explore Mainnet or Testnet',
            url:'docs/intro'
        },
        {
            image: KN3,
            title: 'Elysium vs Ethereum',
            description: 'Elysium is a fully Ethereum-compatible.',
            url:'docs/category/elysium-vs-ethereum'
        },
        {
            image: KN4,
            title: 'Account Balances',
            description: 'An account on Elysium is also an entity with a token balance',
            url:'docs/etherum-vs-elysium/account-balances'
        },
        {
            image: KN5,
            title: 'RPC Method',
            description: 'Elysium RPC Methods',
            url:'docs/etherum-vs-elysium/rpc-methods'
        },
        {
            image: KN6,
            title: 'Transaction Fees',
            description: 'Ethereum and Substrate APIs for sending transfers on Elysium',
            url:'docs/etherum-vs-elysium/transaction-fee'
        },
        {
            image: KN7,
            title: 'Network Endpoints',
            description: 'Elysium network have HTTPS & WSS endpoints available for users to connect',
            url:'docs/network-endpoints'
        },
        {
            image: KN8,
            title: 'Block Explorer',
            description: 'Too see transaction, new blocks & all details.',
            url:'docs/block-explorer'
        },
    ]
    return (
        <>
            <section className="KnowledgeSection">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-12 col-md-6 mx-auto">
                                    <h2 className={'RadialGradient top-minus text-capitalize  text-center Fsize_48 ArchivoLight pb-3 text-shadow'}>Knowledge <span
                                        className={"ArchivoBold"}>Base</span></h2>
                                </div>
                            </div>
                        </div>
                        {
                            data.map((data, i) => {
                                return (
                                    <div className=" col-12  col-md-6 col-xl-3 mb-4">
                                        <Link to={data.url}>
                                        <Cards image={data.image} title={data.title} description={data.description}/>
                                        </Link>
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