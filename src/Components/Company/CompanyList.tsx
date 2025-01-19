import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../ReduxToolkit/Store";
import { fetchCompanies } from "../../ReduxToolkit/Reducers/companySlice";
import { backendURL } from "../../Utils/Constants";

// Reusable CompanyCard Component
const CompanyCard: React.FC<{ company: any; media: any[] }> = ({ company, media }) => {
  console.log(company);
  const activeMedia = media.filter((item) => item.status === "active");

  return (
    <div className="border rounded-lg shadow-lg p-4 bg-white">
      <h2 className="text-xl font-bold">{company.name}</h2>
      <p className="text-sm text-gray-500">{company.description}</p>
      <p className="mt-2">
        <span className="font-semibold">Phone:</span> {company.phone}
      </p>
      <p>
        <span className="font-semibold">Email:</span> {company.email}
      </p>
      <p>
        <span className="font-semibold">Website:</span>{" "}
        <a href={company.website} className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">
          {company.website}
        </a>
      </p>
      <p>
        <span className="font-semibold">Status:</span> {company.status}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {activeMedia.map((mediaItem) => (
          <img
            key={mediaItem.id}
            src={backendURL+mediaItem.file}
            alt={mediaItem.title}
            className="rounded-lg object-cover h-32 w-full"
          />
        ))}
      </div>
    </div>
  );
};

const CompanyList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { companies, isLoading, error } = useSelector((state: RootState) => state.company);
  console.log("Initial companies state:", companies); // Log initial state
  
  const acessToken = useSelector((state: RootState) => state.auth.access);
  //console.log(acessToken);
  

  useEffect(() => {
    if (acessToken) {
      dispatch(fetchCompanies(acessToken));
    }
  }, [dispatch, acessToken]);

  useEffect(() => {
    //console.log("Updated companies state:", companies); // Log state after updates
  }, [companies]);

  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Company List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(companies) && companies.length === 0 ? (
          <p className="text-center col-span-full">No companies available.</p>
        ) : (
          Array.isArray(companies) && companies.map((company, index) => (
            
            
            <CompanyCard key={index} company={company.company} media={company.media} />
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyList;
