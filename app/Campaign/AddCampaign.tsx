"use client";
import TitleSection from '@/components/TitleSection';
import CardSection from '@/components/CardSection';
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import { Controller, Resolver, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { LinkedInLogin } from './LinkedInLogin';
import { CardTitle } from '@/components/ui/card';
import { addCampaignToQueue, campaignCheckLogin } from '@/utils/services/Campaign.service';
import { toast } from 'sonner';
import Loading from '@/components/Loading';

export interface FormValues {
	campaign_name: string;
	search_query: string;
	company: string;
	past_company: string;
	school: string;
}

let schoolArr = [
    {
      label: `IIT`,
      value: "Indian institue of technology",
    },
    {
      label: `BITS`,
      value: "Birla Institute of Technology and Science",
    },
    {
      label: `IIM A`,
      value: "IIM A",
    },
    {
      label: `IIM B`,
      value: "IIM B",
    },
    {
      label: `IIM C`,
      value: "IIM C",
    },
    {
      label: `SRCC`,
      value: "Shri Ram College of Commerce",
    },
    {
      label: `LSR`,
      value: "Lady Shri Ram College",
    },
  ];

  let companyArr = [
    { label: `Stealth`, value: "Stealth" },
    { label: `Mckinsey`, value: "Mckinsey" },
    { label: `BCG`, value: "BCG" },
    { label: `Bain`, value: "Bain" },
    { label: `Flipkart`, value: "Flipkart" },
    { label: `Freshworks`, value: "Freshworks" },
    { label: `Zoho`, value: "Zoho" },
    { label: `Stealth Startup`, value: "Stealth Startup" },
    { label: `Stealth Company`, value: "Stealth Company" },
  ];
  
export const AddCompaign = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [inputTypeDefault, setInputTypeDefault] = useState(true);
	const [isLinkedinSectionActive,setIsLinkedinSectionActive] = useState(true)
	
	const getValidationSchema = () => { 
		return inputTypeDefault? schemaDefault : schema;
	}
	
	const schema = yup.object().shape({
		campaign_name: yup.string()
						.required("Campaign Name is Required")
						.min(3, "Campaign Name should be at least 3 characters")
						.max(50, "Campaign Name should not exceed 50 characters"),
		search_query: yup.string()
						.required("Search Query is Required")
						.min(3, "Search Query should be at least 3 characters")
						.max(50, "Search Query should not exceed 50 characters"),
		company: yup.string()
						.required("Company Name is Required")
						.min(3, "Company Name should be at least 3 characters")
						.max(50, "Company Name should not exceed 50 characters"),
		past_company: yup.string()
						.required("Past Company Name is Required")
						.min(3, "Past Company Name should be at least 3 characters")
						.max(50, "Past Company Name should not exceed 50 characters"),
		school: yup.string()
						.required("School Name is Required")
						.min(3, "School Name should be at least 3 characters")
						.max(50, "School Name should not exceed 50 characters"),
	});

	const schemaDefault = yup.object().shape({
		campaign_name: yup.string()
						.required("Campaign Name is Required")
						.min(3, "Campaign Name should be at least 3 characters")
						.max(50, "Campaign Name should not exceed 50 characters"),
		search_query: yup.string()
						.required("Search Query is Required")
						.min(3, "Search Query should be at least 3 characters")
						.max(50, "Search Query should not exceed 50 characters"),
		company: yup.string()
						.required("Company Name is Required"),
		past_company: yup.string()
						.required("Past Company Name is Required"),
		school: yup.string()
						.required("School Name is Required")
	});

	const checkLoginOnInit = async () => {
		try {
			setIsLoading(true);
			const res = await campaignCheckLogin();
			console.log(res.data.message, res.data);
		
			if (!res.data.isLogin) {
				toast.error(res.data.message);
			} else {
				setIsLinkedinSectionActive(false);
				toast.success(res.data.message);
			}
			setIsLoading(false);
		} catch (error) {
		  console.error(error);
		}
	};

	
	useEffect(() => {
		checkLoginOnInit();
	},[])

	const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
		resolver: yupResolver(getValidationSchema()),
		defaultValues:{
			campaign_name: "",
			search_query: "",
			company: "",
			past_company: "",
			school: "",
		}
	  });

	const handleBasicSearch = async (data:FormValues) => {
		try {
			let obj = {
				name : data.campaign_name,
				oneTimeLink : "",
				searchQuery : data.search_query,
				page : 1,
				company : data.company,
				school : data.school,
				pastCompany : data.past_company,
				linkedInAccountId : "",
				proxyId :"",
			};
			let { data: res } = await addCampaignToQueue(obj);
			if (res.message) {
				toast.success(res.message);
			}
		} catch (error:any) {
			toast.error(error);
		}
	};

	const onSubmitHandler = (data: FormValues) => {
		handleBasicSearch(data)
		reset({});
	};

	return (
		<>
			<div className='flex justify-between items-center py-2'>
				<TitleSection title={"New Campaign"} />
			</div>
			{
				isLoading ? <Loading/>
				:
				<div className='w-full'>
					{
						!isLinkedinSectionActive ? 
						<CardSection title='Campaign for LinkedIn' description=''>
							<div className="-mt-4 flex w-full justify-end items-center">
								<Button 
									className='bg-[#D68392] hover:bg-[#d68392b0]'
									onClick={()=> setIsLinkedinSectionActive(true)}
								>
									LinkedIn Accounts
								</Button>
								<div className='ps-4 w-1/4'>
									<Select defaultValue='default' onValueChange={(value)=> {setInputTypeDefault(value==='default'); reset({})}}>
										<SelectTrigger id="inputType">
											<SelectValue placeholder="Select" />
										</SelectTrigger>
										<SelectContent position="popper">
											<SelectItem  value="default">Use Default Inputs</SelectItem>
											<SelectItem  value="new">Add New Inputs</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<form onSubmit={handleSubmit(onSubmitHandler)}>
								<div className="grid w-full items-center gap-4">
									<Controller
										name="campaign_name"
										control={control}
										render={({ field }) => (
											<div className="flex flex-col w-full space-y-1.5">
												<Label htmlFor="campaign_name">Campaign Name</Label>
												<Input
													value = {field.value} 
													id="campaign_name" 
													placeholder="Enter Campaign Name"
													onChange={(value)=>{
														field.onChange(value);
													}
												}
												/>
											{errors.campaign_name && <div className="text-red-500 mt-1">{errors.campaign_name.message}</div>}
											</div>
										)}
									/>
									
									<div className='flex flex-wrap'>
										<div className="flex flex-col w-1/2 space-y-1.5 pb-3 pe-4">
											<Controller
												name="search_query"
												control={control}
												render={({ field }) => (
														<>
															<Label htmlFor="search_query">Search Query</Label>
															<Input 
																value = {field.value} 
																id="search_query"  
																placeholder="Enter Search Query"
																onChange={(value)=>{
																	field.onChange(value);
																}
															}
															/>
														</>
													)}
													/>
											{errors.search_query && <div className="text-red-500 mt-1">{errors.search_query.message}</div>}
										</div>
										<div className="flex flex-col w-1/2 space-y-1.5 pb-3">
										{
											inputTypeDefault ? 
											<>
												<Controller
													name="company"
													control={control}
													render={({ field }) => (
														<div className="flex flex-col w-full space-y-1.5">
															<Label htmlFor="company">Company</Label>
															<Select
																value={field.value}
																onValueChange={
																	(value) => field.onChange(value)
																}
															>
																<SelectTrigger id="company">
																<SelectValue placeholder="Select Company" />
																</SelectTrigger>
																<SelectContent position="popper">
																<SelectContent position="popper">
																	{companyArr.map(company =>
																		<SelectItem key={company.label} value={company.value}>{company.label}</SelectItem>
																	)}
																</SelectContent>
																</SelectContent>
															</Select>
														</div>
													)}
												/>
												{errors.company && <div className="text-red-500 mt-1">{errors.company.message}</div>}
											</>
											:
											<>
												<Controller
													name="company"
													control={control}
													render={({ field }) => (
														<>
															<Label htmlFor="company">Company</Label>
															<Input 
																id="company"  
																placeholder="Enter Company"
																value={field.value}
																onChange={(value)=>{
																	field.onChange(value);
																}
															}
															/>
														</>
													)}
												/>
												{errors.company && <div className="text-red-500 mt-1">{errors.company.message}</div>}
											</>
											
											}
										</div>
										<div className="flex flex-col w-1/2 space-y-1.5 pe-4 pb-3">
										{
											inputTypeDefault ? 
											<>
												<Controller
													name="past_company"
													control={control}
													render={({ field }) => (
														<>
															<Label htmlFor="past_company">Past Company</Label>
															<Select
																value={field.value}
																onValueChange={
																	(value) => field.onChange(value)
																}
															>
																<SelectTrigger id="past_company">
																<SelectValue placeholder="Select Past Company" />
																</SelectTrigger>
																<SelectContent position="popper">
																	{companyArr.map(company =>
																		<SelectItem key={company.label} value={company.value}>{company.label}</SelectItem>
																	)}
																</SelectContent>
															</Select>
														</>
													)}
												/>
												{errors.past_company && <div className="text-red-500 mt-1">{errors.past_company.message}</div>}
											</>
											:
											<>
												<Controller
													name="past_company"
													control={control}
													render={({ field }) => (
														<>
															<Label htmlFor="past_company">Past Company</Label>
															<Input 
																id="past_company"
																value={field.value}  
																placeholder="Enter Company"
																onChange={(value)=>{
																	field.onChange(value);
																}
															}
															/>
														</>
													)}
												/>
												{errors.past_company && <div className="text-red-500 mt-1">{errors.past_company.message}</div>}
											</>
											
											}
										</div>
										<div className="flex flex-col w-1/2 space-y-1.5 pb-3">
										{
											inputTypeDefault ? 
											<>
												<Controller
													name="school"
													control={control}
													render={({ field }) => (
														<div className="flex flex-col w-full space-y-1.5">
															<Label htmlFor="school">School</Label>
															<Select
																value={field.value}
																onValueChange={
																	(value) =>{ field.onChange(value);}
																}
															>
																<SelectTrigger id="school">
																<SelectValue placeholder="Select School" />
																</SelectTrigger>
																<SelectContent position="popper">
																	{
																		schoolArr.map((school) =>
																			<SelectItem key={school.value}  value={school.value}>{school.label}</SelectItem>
																		)
																	}
																</SelectContent>
															</Select>
														</div>
													)}
												/>
												{errors.school && <div className="text-red-500 mt-1">{errors.school.message}</div>}
											</>
											:
											<>
												<Controller
													name="school"
													control={control}
													render={({ field }) => (
														<div className="flex flex-col w-full space-y-1.5">
															<Label htmlFor="school">School</Label>
															<Input 
																id="school"
																value={field.value}  
																placeholder="Enter school"
																onChange={(value)=>{
																	field.onChange(value);
																}
															}
															/>
														</div>
													)}
												/>
												{errors.school && <div className="text-red-500 mt-1">{errors.school.message}</div>}
											</>
											
											}
										</div>
									</div>

									<div className='flex justify-center'>
										<Button 
											className='w-1/4 bg-[#D68392] hover:bg-[#d68392b0]'
											disabled={isSubmitting}
											type='submit'
										>
											Start Campaign
										</Button>
									</div>
								</div>
							</form>
						</CardSection>
						:
						<LinkedInLogin 
							OnCancel={
								()=>setIsLinkedinSectionActive(false)
							} 
							onLogin = {
								()=> {
									checkLoginOnInit();
								}
							} 
						/>
					}
				</div>
			}
			
		</>
	)
}