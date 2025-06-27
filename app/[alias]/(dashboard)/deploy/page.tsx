import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DeployContractPage from './depoly';

export default function page() {
    return (
        <div className="w-full">
            <Card className="w-full border-none">
                <CardHeader>
                    <CardTitle>Deploy Smart Contract</CardTitle>
                </CardHeader>
                <DeployContractPage />
            </Card>
        </div>
    )
}
