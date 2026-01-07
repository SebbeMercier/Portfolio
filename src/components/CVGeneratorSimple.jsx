// CVGeneratorSimple.jsx - Version simplifiée pour tester React-PDF
import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet
} from '@react-pdf/renderer';

// Styles simples et compatibles React-PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    backgroundColor: '#8B5CF6',
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    color: '#E2E8F0',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#8B5CF6',
  },
  text: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 1.5,
    marginBottom: 8,
  },
  list: {
    marginLeft: 15,
  },
  listItem: {
    fontSize: 11,
    color: '#4B5563',
    marginBottom: 4,
  },
});

const CVDocumentSimple = ({ cvData }) => {
  const { personalInfo, experiences, skills, projects } = cvData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo?.name || 'Nom non défini'}</Text>
          <Text style={styles.title}>{personalInfo?.title || 'Titre non défini'}</Text>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACT</Text>
          <Text style={styles.text}>Email: {personalInfo?.email || 'N/A'}</Text>
          <Text style={styles.text}>Téléphone: {personalInfo?.phone || 'N/A'}</Text>
          <Text style={styles.text}>Localisation: {personalInfo?.location || 'N/A'}</Text>
          {personalInfo?.website && (
            <Text style={styles.text}>Site web: {personalInfo.website}</Text>
          )}
        </View>

        {/* Résumé */}
        {personalInfo?.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFIL</Text>
            <Text style={styles.text}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Expériences */}
        {experiences && experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXPÉRIENCE PROFESSIONNELLE</Text>
            {experiences.slice(0, 3).map((exp, index) => (
              <View key={index} style={{ marginBottom: 15 }}>
                <Text style={[styles.text, { fontWeight: 'bold' }]}>
                  {exp.title} - {exp.company}
                </Text>
                <Text style={[styles.text, { fontSize: 10, color: '#6B7280' }]}>
                  {exp.start_date} - {exp.current ? 'Présent' : exp.end_date}
                </Text>
                {exp.description && (
                  <Text style={styles.text}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Compétences */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>COMPÉTENCES</Text>
            <View style={styles.list}>
              {skills.slice(0, 8).map((skill, index) => (
                <Text key={index} style={styles.listItem}>
                  • {skill.name} ({skill.level}/5)
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Projets */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROJETS CLÉS</Text>
            {projects.slice(0, 2).map((project, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={[styles.text, { fontWeight: 'bold' }]}>
                  {project.title}
                </Text>
                <Text style={styles.text}>{project.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={{ marginTop: 'auto', paddingTop: 20, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
          <Text style={[styles.text, { fontSize: 8, color: '#9CA3AF', textAlign: 'center' }]}>
            CV généré automatiquement le {new Date().toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default CVDocumentSimple;