import React from 'react';
import Layout from '@theme/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../static/icons/css/animation.css'
import '../../static/icons/css/elysium-20-icons-embedded.css'
import '../../static/icons/css/elysium-20-icons-codes.css'
import '../../static/icons/css/elysium-20-icons-ie7-codes.css'
import '../../static/icons/css/elysium-20-icons.css'
import '../../static/icons/css/elysium-20-icons-ie7.css'
import SearchSection from '../components/SeaarchSection/SearchSection'
import CardSection from '../components/CardSection/CardSection'
import KnowledgeSection from '../components/KnowledgeSection/CardSection'

export default function Home() {
    return (
        <div className={'my-body'}>
            <Layout
                title={``}
                description="Everything you need to know to get started developing, deploying, and interacting with smart contracts on Elysium."
            >
                <div className={"header-layout"}>
                    <SearchSection />
                    <CardSection/>
                    <KnowledgeSection/>
                    
                </div>
            </Layout>
        </div>

    );
}
