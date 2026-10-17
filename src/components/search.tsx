import { useStaticSearch } from 'fumadocs-core/search/client';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
  TagsList,
  TagsListItem,
} from 'fumadocs-ui/components/dialog/search';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { getVersionFromPath, latestVersion, versions } from '@/lib/versions';

/**
 * Searches the index prerendered at /api/search.json in the browser,
 * limited to the current language and (by default) the version being read.
 */
export default function NinoSearchDialog(props: SharedProps) {
  const { locale } = useI18n();
  const { pathname } = useLocation();
  const [tag, setTag] = useState<string | undefined>(
    getVersionFromPath(pathname) ?? latestVersion,
  );
  const search = useStaticSearch({ from: '/api/search.json', locale, tag });

  return (
    <SearchDialog {...search} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList />
        <SearchDialogFooter>
          <TagsList tag={tag} onTagChange={setTag} allowClear>
            {versions.map((version) => (
              <TagsListItem key={version} value={version}>
                {version}
              </TagsListItem>
            ))}
          </TagsList>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
