import {
  Badge,
  Box,
  Button,
  CloseButton,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconArrowDown,
  IconMail,
  IconSearch,
} from "@tabler/icons-react";
import { COMPANY, HIGHLIGHTS } from "../data/catalog";
import { openQuoteForm } from "../hooks/useQuote";
import { CeMark } from "./CeMark";
import classes from "./Hero.module.css";

interface Props {
  query: string;
  onQuery: (v: string) => void;
}

const goToCatalog = () =>
  document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });

export function Hero({ query, onQuery }: Props) {
  return (
    <Box component="section" id="inicio" className={classes.hero}>
      <div className={classes.overlay} />
      <Container size="xl" className={classes.inner}>
        {/* 880 y no 760: con 760 los tres motivos no cabían en una fila y el
            tercero («Certificado») bajaba solo a otra. El texto largo sigue
            con su propio límite (`.lead`, 56ch; el buscador, 480px). */}
        <Stack gap="lg" maw={880}>
          {/* La provincia va arriba del todo: «envase y embalaje en Zaragoza» es
              lo que se busca, y quien entra necesita saber en dos segundos si
              le cae cerca. */}
          <Badge size="lg" radius="xl" className={classes.year}>
            Distribuidor en {COMPANY.province}
          </Badge>

          {/* El H1 lleva producto y provincia: es la búsqueda que trae clientes
              («envases y embalajes Zaragoza») y antes sólo estaba en el <title>,
              donde el visitante no lo lee. */}
          <Title order={1} c="white">
            Envases y embalajes industriales en {COMPANY.province}
          </Title>

          <Text size="lg" className={classes.lead}>
            Precinto, film estirable, burbuja, foam, fleje, cartón, palés y
            maquinaria, con un solo proveedor. Ficha técnica en cada producto y
            presupuesto sin compromiso.
          </Text>

          <TextInput
            size="md"
            radius="xl"
            className={classes.search}
            placeholder="Buscar producto, material o medida…"
            value={query}
            onChange={(e) => onQuery(e.currentTarget.value)}
            leftSection={<IconSearch size={18} />}
            rightSection={
              query ? (
                <CloseButton
                  onClick={() => onQuery("")}
                  aria-label="Limpiar búsqueda"
                />
              ) : null
            }
            aria-label="Buscar en el catálogo"
          />

          <Group gap="sm">
            <Button
              size="md"
              radius="xl"
              variant="white"
              color="dark"
              rightSection={<IconArrowDown size={16} />}
              onClick={goToCatalog}
            >
              Ver el catálogo
            </Button>
            <Button
              size="md"
              radius="xl"
              variant="outline"
              className={classes.ghost}
              leftSection={<IconMail size={16} />}
              onClick={() => openQuoteForm()}
            >
              Pedir presupuesto
            </Button>
          </Group>

          {/*
            Motivos de compra, no recuentos. Antes aquí ponía «9 familias de
            producto» y «CE», que no son razones para elegir a nadie: el catálogo
            ya se ve entero unos centímetros más abajo. Los accesos por familia
            que había en esta misma zona se han quitado porque repetían, uno por
            uno, los filtros del catálogo.
          */}
          <Group
            gap="clamp(1rem, 3vw, 2.5rem)"
            wrap="nowrap"
            align="flex-start"
            className={classes.stats}
          >
            {HIGHLIGHTS.map((s) => (
              <Box key={s.label} className={classes.stat}>
                <Text className={classes.statValue}>
                  {s.mark === "ce" ? (
                    // El sello mide lo que una mayúscula: con la altura de la
                    // línea entera se comería la palabra de al lado.
                    <span className={classes.withMark}>
                      {s.value}
                      <CeMark height="0.74em" />
                    </span>
                  ) : (
                    s.value
                  )}
                </Text>
                <Text className={classes.statLabel}>{s.label}</Text>
              </Box>
            ))}
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}
