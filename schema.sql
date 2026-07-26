-- 1. Crear la tabla de Perfiles
CREATE TABLE perfiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_empresa VARCHAR(255) NOT NULL,
    telefono_sms VARCHAR(50),
    telegram_id VARCHAR(100),
    telegram_activo BOOLEAN DEFAULT FALSE,
    sms_activo BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crear la tabla de Sectores
CREATE TABLE perfil_sectores (
    id BIGSERIAL PRIMARY KEY,
    perfil_id UUID REFERENCES perfiles(id) ON DELETE CASCADE,
    sector VARCHAR(100) NOT NULL
);

-- 3. Crear la tabla de Palabras Clave
CREATE TABLE perfil_palabras_clave (
    id BIGSERIAL PRIMARY KEY,
    perfil_id UUID REFERENCES perfiles(id) ON DELETE CASCADE,
    palabra_clave VARCHAR(100) NOT NULL
);

-- 4. Crear la tabla de Licitaciones
CREATE TABLE licitaciones (
    id_sicoes VARCHAR(50) PRIMARY KEY,
    titulo TEXT NOT NULL,
    entidad VARCHAR(255) NOT NULL,
    presupuesto NUMERIC(15, 2) NOT NULL,
    moneda VARCHAR(10) DEFAULT 'Bs.',
    modalidad VARCHAR(100),
    plazo_presentacion VARCHAR(255),
    enlace_pliego TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Crear la tabla de Evaluaciones
CREATE TABLE evaluaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_id UUID REFERENCES perfiles(id) ON DELETE CASCADE,
    id_sicoes VARCHAR(50) REFERENCES licitaciones(id_sicoes) ON DELETE CASCADE,
    match_score INTEGER CHECK (match_score BETWEEN 0 AND 100),
    match_level VARCHAR(20) CHECK (match_level IN ('Alto', 'Medio', 'Bajo')),
    resumen_ia TEXT NOT NULL,
    estado_evaluacion VARCHAR(20) CHECK (estado_evaluacion IN ('Aprobado', 'Descartado')),
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Crear la tabla de Logs de Notificaciones
CREATE TABLE logs_notificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluacion_id UUID REFERENCES evaluaciones(id) ON DELETE CASCADE,
    canal VARCHAR(20) CHECK (canal IN ('Telegram', 'SMS')),
    estado_zavu VARCHAR(20) CHECK (estado_zavu IN ('Enviado', 'Fallido', 'Pendiente')),
    mensaje_error TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de Rendimiento para Búsquedas Rápidas
CREATE INDEX idx_sectores_perfil ON perfil_sectores(perfil_id);
CREATE INDEX idx_palabras_perfil ON perfil_palabras_clave(perfil_id);
CREATE INDEX idx_evaluaciones_perfil ON evaluaciones(perfil_id);
CREATE INDEX idx_evaluaciones_licitacion ON evaluaciones(id_sicoes);
