"use client";
import FullLayout from '@/components/layouts/FullLayout'
import ContainerWrapper from '@/components/wrappers/ContainerWrapper'
import React, { useState } from 'react';
import {AddCompaign} from './AddCampaign'
import { LinkedInLogin } from './LinkedInLogin';

const Campaign = () => {

  // const [isLinkedinActive,setIsLinkedinActive] = useState(true);
  // const [linkedinCred,setLinkedinCred]  = useState({});

  return (
    <FullLayout>
      <ContainerWrapper>
          <AddCompaign/> 
      </ContainerWrapper>
    </FullLayout>
  )
}

export default Campaign
