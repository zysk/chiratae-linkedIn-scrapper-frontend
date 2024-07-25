import React from "react";

type TitleSectionProps = {
  title: string;
  subtitle?: string;
};

const TitleSection = ({ title, subtitle }: TitleSectionProps) => {
  return (
    <>
    <div className="flex justify-start">
      <h2 className="text-[28px] font-semibold leading-[60px]">{title}</h2>
      { subtitle && <h6 className="text-lg text-[#FFFFFF99] leading-8">{subtitle}</h6> }
    </div>
    </>
  );
};

export default TitleSection;
