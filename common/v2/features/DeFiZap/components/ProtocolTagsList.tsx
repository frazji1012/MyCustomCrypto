import React from 'react';
import { TagsList } from 'v2/components';
import { getPlatformColor } from '../helpers';

interface Props {
  platformsUsed: string[];
}

const ProtocolTagsList = ({ platformsUsed }: Props) => {
  const platformTags = platformsUsed.map(platform => ({
    tagText: platform,
    color: getPlatformColor(platform)
  }));
  return <TagsList tags={platformTags} />;
};

export default ProtocolTagsList;
