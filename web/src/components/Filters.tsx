import { Box, Button, Chip, Group, Pill, Text } from '@mantine/core';
import { IconFilterOff } from '@tabler/icons-react';
import {
  TAGS,
  categories,
  categoryById,
  type CategoryId,
  type Tag,
} from '../data/catalog';
import classes from './Filters.module.css';

export interface FilterProps {
  active: CategoryId | 'all';
  tags: Tag[];
  query: string;
  categoryCounts: Record<CategoryId | 'all', number>;
  tagCounts: Record<Tag, number>;
  isFiltering: boolean;
  onCategory: (v: CategoryId | 'all') => void;
  onTags: (v: Tag[]) => void;
  onQuery: (v: string) => void;
  onReset: () => void;
  /** En el panel del móvil los grupos se apilan; en la barra van en línea. */
  stacked?: boolean;
}

export const catChips: { id: CategoryId | 'all'; label: string }[] = [
  { id: 'all', label: 'Todo el catálogo' },
  ...categories.map((c) => ({ id: c.id, label: c.name })),
];

export function Filters({
  active,
  tags,
  query,
  categoryCounts,
  tagCounts,
  isFiltering,
  onCategory,
  onTags,
  onQuery,
  onReset,
  stacked,
}: FilterProps) {
  const rowClass = stacked ? classes.filterWrap : classes.filterRow;

  return (
    <>
      <Box>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={8}>
          Categoría
        </Text>
        <Group gap={8} className={rowClass} wrap={stacked ? 'wrap' : 'nowrap'}>
          {catChips.map((c) => (
            <Chip
              key={c.id}
              checked={active === c.id}
              onChange={() => onCategory(c.id)}
              variant="outline"
              radius="xl"
              size="sm"
              disabled={categoryCounts[c.id] === 0 && active !== c.id}
            >
              {c.label}{' '}
              <Text span c="dimmed" fz="xs">
                {categoryCounts[c.id]}
              </Text>
            </Chip>
          ))}
        </Group>
      </Box>

      <Group justify="space-between" align="flex-end" gap="md" mt="md">
        <Box>
          <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={8}>
            Característica
          </Text>
          <Chip.Group multiple value={tags} onChange={(v) => onTags(v as Tag[])}>
            <Group gap={8} className={rowClass} wrap={stacked ? 'wrap' : 'nowrap'}>
              {TAGS.map((t) => (
                <Chip
                  key={t}
                  value={t}
                  variant="outline"
                  radius="xl"
                  size="sm"
                  disabled={tagCounts[t] === 0 && !tags.includes(t)}
                >
                  {t}{' '}
                  <Text span c="dimmed" fz="xs">
                    {tagCounts[t]}
                  </Text>
                </Chip>
              ))}
            </Group>
          </Chip.Group>
        </Box>

        {isFiltering && !stacked && (
          <Button
            variant="subtle"
            color="gray"
            size="compact-sm"
            leftSection={<IconFilterOff size={16} />}
            onClick={onReset}
          >
            Quitar filtros
          </Button>
        )}
      </Group>

      {/* Resumen de lo aplicado: se ve de un vistazo por qué la lista está
          recortada, y cada criterio se puede quitar por separado. */}
      {isFiltering && (
        <Group gap={6} mt="sm">
          <Text size="xs" c="dimmed" fw={600}>
            Filtros activos:
          </Text>
          {active !== 'all' && (
            <Pill withRemoveButton onRemove={() => onCategory('all')}>
              {categoryById(active).name}
            </Pill>
          )}
          {query.trim() !== '' && (
            <Pill withRemoveButton onRemove={() => onQuery('')}>
              «{query.trim()}»
            </Pill>
          )}
          {tags.map((t) => (
            <Pill key={t} withRemoveButton onRemove={() => onTags(tags.filter((x) => x !== t))}>
              {t}
            </Pill>
          ))}
        </Group>
      )}

      {isFiltering && stacked && (
        <Button
          fullWidth
          variant="light"
          color="gray"
          mt="md"
          leftSection={<IconFilterOff size={16} />}
          onClick={onReset}
        >
          Quitar todos los filtros
        </Button>
      )}
    </>
  );
}
