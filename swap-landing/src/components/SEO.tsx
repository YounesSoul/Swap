import { useEffect } from "react";

type SEOProps = {
   pageTitle: string;
};

const SEO = ({ pageTitle }: SEOProps) => {
   useEffect(() => {
      document.title = `${pageTitle} - Exchange Your Skills & Knowledge`;
   }, [pageTitle]);

   return null;
};

export default SEO;