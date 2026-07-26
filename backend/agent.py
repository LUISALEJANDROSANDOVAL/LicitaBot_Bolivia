from typing import Dict, Any

def evaluar_licitacion(licitacion: Dict[str, Any], perfil: Dict[str, Any]) -> Dict[str, Any]:
    """
    Simula la decisión cognitiva del Agente de IA (Persona 1) cruzando 
    la licitación con el perfil de la PyME.
    
    Retorna un diccionario de evaluación con el score, nivel, resumen y decisión.
    """
    titulo = licitacion["titulo"].lower()
    keywords = perfil.get("palabras_clave", [])
    sectores = perfil.get("sectores", [])
    
    # Buscar coincidencias de palabras clave
    coincidencias = [kw for kw in keywords if kw.lower() in titulo]
    
    # Evaluar relevancia
    has_keyword_match = len(coincidencias) > 0
    
    # Evaluar si la licitación encaja en el sector (obras civiles, proveeduría, etc.)
    # Para fines del mock, asumiremos que si habla de pavimentación, cemento, asfalto o puente,
    # corresponde al sector de "Obras civiles".
    es_obra_civil = any(term in titulo for term in ["puente", "pavimentación", "cemento", "asfalto", "construcción", "muro", "vial"])
    obra_civil_perfil = "Obras civiles" in sectores
    
    match_score = 0
    match_level = "Bajo"
    estado_evaluacion = "Descartado"
    resumen_ia = ""
    
    if has_keyword_match and (es_obra_civil and obra_civil_perfil):
        # Match Alto
        match_score = 90 + len(coincidencias) * 2
        if match_score > 100:
            match_score = 100
        match_level = "Alto"
        estado_evaluacion = "Aprobado"
        coincidencia_str = ", ".join(coincidencias)
        resumen_ia = (
            f"¡Excelente oportunidad detectada! Esta licitación encaja perfectamente con tu rubro "
            f"de 'Obras civiles'. Hace match con las palabras clave de tu interés: '{coincidencia_str}'. "
            f"El presupuesto de {licitacion.get('presupuesto')} es apto y el plazo de presentación "
            f"es de {licitacion.get('plazo_presentacion')}. Se recomienda preparar la postulación."
        )
    elif es_obra_civil and obra_civil_perfil:
        # Match Medio (coincide sector pero no keywords específicas)
        match_score = 70
        match_level = "Medio"
        estado_evaluacion = "Aprobado" # En el backend podemos configurar si los medios también notifican
        resumen_ia = (
            f"Licitación de coincidencia media. Pertenece a tu rubro principal de 'Obras civiles', "
            f"aunque no contiene ninguna de tus palabras clave configuradas. El objeto es '{licitacion['titulo']}'. "
            f"Evalúa si tu empresa cuenta con la capacidad técnica requerida."
        )
    elif has_keyword_match:
        # Match Medio (coinciden palabras clave pero no es rubro principal)
        match_score = 60
        match_level = "Medio"
        estado_evaluacion = "Aprobado"
        coincidencia_str = ", ".join(coincidencias)
        resumen_ia = (
            f"Match de interés medio. Contiene la palabra clave '{coincidencia_str}', pero el rubro "
            f"del proyecto podría estar fuera de tu sector principal. Revisa los detalles del pliego."
        )
    else:
        # Match Bajo
        match_score = 25
        match_level = "Bajo"
        estado_evaluacion = "Descartado"
        resumen_ia = (
            f"Esta licitación fue filtrada y descartada automáticamente. No coincide con tu rubro "
            f"de interés ({', '.join(sectores)}) ni contiene palabras clave configuradas en tu perfil."
        )

    return {
        "perfil_id": perfil["id"],
        "id_sicoes": licitacion["id_sicoes"],
        "match_score": match_score,
        "match_level": match_level,
        "resumen_ia": resumen_ia,
        "estado_evaluacion": estado_evaluacion
    }
