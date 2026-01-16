import Image from "next/image";

type Props = {
  children: React.ReactNode;
  header: string;
};

export const AuthLayout = ({ children, header }: Props) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc]"> 
      <div className="px-4 md:px-0 max-w-[480px] w-full"> 
        
        {/* Header Section */}
        <div className="flex items-center gap-x-3 mb-8">
          <div className="rounded-xl bg-white p-2.5 shadow-sm border border-slate-200/60">
             {/* Logo OTEP */}
             <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                OTEP
             </div>
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-[24px] font-bold text-slate-900 leading-tight tracking-tight">
              OTEP Web
            </h3>
            <h4 className="text-[14px] text-slate-500 font-medium">
              Back office system
            </h4>
          </div>
        </div>

        {/* Page Header - "Sign In to your account" */}
        <h3 className="text-left text-[18px] font-semibold mb-5 text-slate-800 tracking-tight">
          {header}
        </h3>
        
        {/* Content Card */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)] border border-slate-200/60">
          {children}
        </div>

       
      </div>
    </div>
  );
};