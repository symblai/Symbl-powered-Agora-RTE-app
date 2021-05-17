import { useContext } from 'react';
import React from "react";
import { SymblContext } from './SendStream';

export default function useSymblContext() {
    const context = React.useContext(SymblContext);
    console.log("inside symbl context");
   /* if (!context) {
        throw new Error('useSymblContext must be used within a IntelligenceProvider');
    }*/
    if(context!=null)
    {return context;}
    return context;
}
