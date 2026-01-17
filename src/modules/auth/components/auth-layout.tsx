import Image from "next/image";

type Props = {
  children: React.ReactNode;
  header: string;
};

export const AuthLayout = ({ children, header }: Props) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50/50">
      <div className="px-4 w-full max-w-[600px]"> 
        <div className="flex items-start justify-start gap-x-5 mb-5">
           
           <div className="w-16 h-16 relative rounded-full overflow-hidden shrink-0 shadow-lg shadow-pink-100 border-2 border-white">
              <Image 
                src="/img/Otep.jpg"
                alt="OTEP Logo"
                fill 
                className="object-cover" 
                priority
              />
           </div>
          
          <div className="flex flex-col items-start">
            <h3 className="text-3xl font-bold text-slate-800 leading-tight">
                OTEP Web
            </h3>
            <p className="text-base text-slate-500 font-medium">
                Back Office System
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white p-10 md:p-12 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100">
            <h4 className="text-xl font-bold text-slate-800 mb-8 text-left">
              {header}
            </h4>
            
            <div>
              {children}
            </div>
        </div>

      </div>
    </div>
  );
};