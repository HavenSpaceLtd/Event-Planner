import React from 'react';
import ResourceItem from './ResourceItem';

const ResourceList = ({ resources, onDelete }) => {
  return (
    <div>
      {resources.map(resource => (
        <ResourceItem key={resource.id} resource={resource} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ResourceList;