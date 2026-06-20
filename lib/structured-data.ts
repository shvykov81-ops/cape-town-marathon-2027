export interface EventStructuredDataProps {
  name: string;
  startDate: string;
  endDate?: string;
  location: {
    name: string;
    address: string;
  };
  organizer: {
    name: string;
    url: string;
  };
  image: string;
  description: string;
}

export function generateEventStructuredData(props: EventStructuredDataProps) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": props.name,
    "startDate": props.startDate,
    "endDate": props.endDate,
    "location": {
      "@type": "Place",
      "name": props.location.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": props.location.address,
      },
    },
    "organizer": {
      "@type": "Organization",
      "name": props.organizer.name,
      "url": props.organizer.url,
    },
    "image": props.image,
    "description": props.description,
  };
}

export interface PersonStructuredDataProps {
  name: string;
  jobTitle: string;
  url: string;
  image?: string;
  ratingValue?: number;
  reviewCount?: number;
  description?: string;
}

export function generatePersonStructuredData(props: PersonStructuredDataProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": props.name,
    "jobTitle": props.jobTitle,
    "url": props.url,
  };

  if (props.image) {
    data.image = props.image;
  }

  if (props.description) {
    data.description = props.description;
  }

  if (props.ratingValue !== undefined && props.reviewCount !== undefined) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": props.ratingValue,
      "reviewCount": props.reviewCount,
    };
  }

  return data;
}

export interface OrganizationStructuredDataProps {
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
}

export function generateOrganizationStructuredData(props: OrganizationStructuredDataProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": props.name,
    "url": props.url,
    "logo": props.logo,
    "sameAs": props.sameAs,
  };
}

export interface BreadcrumbStructuredDataProps {
  items: { name: string; url: string }[];
}

export function generateBreadcrumbStructuredData(props: BreadcrumbStructuredDataProps) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": props.items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}
