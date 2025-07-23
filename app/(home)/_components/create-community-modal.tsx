'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import DeployOptions, { DeployOptionsProps } from './deploy-options';
import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import React from 'react';
import CreateCommunityForm from './create-form';

export type DeployOption = 'live' | 'demo';

export default function CreateCommunityModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [deployOption, setDeployOption] = useState<DeployOption | null>(null);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setDeployOption(null);
    }
  };

  const handleSuccess = () => {
    setIsOpen(false);
    setDeployOption(null);
  };

  const deployDemo: DeployOptionsProps = {
    title: 'Demo',
    description: 'Create a demo community and try Citizen Wallet for free',
    features: [],
    handleSelect: () => {
      setDeployOption('demo');
    }
  };

  const deployLive: DeployOptionsProps = {
    title: 'Live',
    description: 'Start a community on Citizen Wallet',
    features: [],
    handleSelect: () => {
      setDeployOption('live');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="default"
          className="flex items-center gap-2 w-auto px-4 py-2 mb-4 font-medium transition-colors hover:bg-primary/90"
        >
          <Plus size={16} />
          Create Community
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] w-[90vw] h-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Community</DialogTitle>
        </DialogHeader>

        {/* Page 1: Select Demo vs Live */}
        {deployOption === null && (
          <React.Fragment key="page1">
            <DialogDescription>
              Try Citizen Wallet for free or start your live community
            </DialogDescription>
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              <DeployOptions {...deployDemo} />
              <DeployOptions {...deployLive} />
            </div>
          </React.Fragment>
        )}

        {/* Page 2: Show selected option */}
        {deployOption !== null && (
          <React.Fragment key="page2">
            <div>
              <Button
                variant="outline"
                size="icon"
                className="flex items-center gap-2 rounded-full"
                onClick={() => setDeployOption(null)}
              >
                <ArrowLeft size={16} />
              </Button>
            </div>

            <DialogDescription>
              Create a new community by selecting a blockchain and providing
              basic information.
            </DialogDescription>
            <CreateCommunityForm deployOption={deployOption} onSuccess={handleSuccess} />
          </React.Fragment>
        )}

        <DialogFooter>
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
